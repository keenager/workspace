"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { CalendarEvent, Prisma } from "../../../../generated/prisma/client";
import { revalidatePath } from "next/cache";
import { SessionUser } from "@/lib/auth";

export type ActionResult = {
  isSuccess: boolean;
  message?: string;
  eventId?: string;
};

const decorator = (
  originalFn: (session: SessionUser, ...args: any[]) => Promise<ActionResult>,
) => {
  return async (...args: any[]): Promise<ActionResult> => {
    const session = await getSession();
    if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };
    try {
      const result = await originalFn(session, ...args);
      revalidatePath("/calendar");
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        return { isSuccess: false, message: error.message };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { isSuccess: false, message: error.message };
      }
      return { isSuccess: false, message: "알 수 없는 오류 발생" };
    }
  };
};

export const createEvent = decorator(
  async (session: SessionUser, formData: FormData): Promise<ActionResult> => {
    const assigneeIds = formData.getAll("assigneeIds") as string[];

    const { title, description, startDate, endDate, priority } =
      Object.fromEntries(formData.entries()) as unknown as CalendarEvent;
    const allDay = formData.get("allDay") === "on";

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        allDay,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        priority,
        request: {
          create: {
            requestedById: session.id,
            assignees: {
              create: assigneeIds.map((id) => ({
                userId: id,
                status: id === session.id ? "CONFIRMED" : "PENDING",
              })),
            },
          },
        },
      },
    });

    return { isSuccess: true, eventId: event.id };
  },
);

export const getMyEvents = async () => {
  const session = await getSession();
  if (!session) return [];

  return await prisma.calendarEvent.findMany({
    where: {
      request: {
        OR: [
          { requestedById: session.id },
          { assignees: { some: { userId: session.id } } },
        ],
      },
    },
    include: {
      request: {
        include: {
          requestedBy: { select: { id: true, name: true } },
          assignees: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });
};

export const updateEvent = decorator(
  async (
    session: SessionUser,
    eventId: string,
    formData: FormData,
  ): Promise<ActionResult> => {
    const event = await prisma.calendarEvent.findFirst({
      where: { id: eventId, request: { requestedById: session.id } },
      include: { request: true },
    });
    if (!event || !event.request)
      return { isSuccess: false, message: "수정 권한이 없습니다." };

    const assigneeIds = formData.getAll("assigneeIds") as string[];
    const { title, description, startDate, endDate, priority } =
      Object.fromEntries(formData.entries()) as unknown as CalendarEvent;
    const allDay = formData.get("allDay") === "on";

    await prisma.calendarEvent.update({
      where: { id: eventId },
      data: {
        title,
        description,
        allDay,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        priority,
        request: {
          update: {
            assignees: {
              deleteMany: { userId: { notIn: assigneeIds } },
              upsert: assigneeIds.map((id) => ({
                where: {
                  requestId_userId: {
                    requestId: event.request!.id,
                    userId: id,
                  },
                },
                update: {},
                create: {
                  userId: id,
                  status: id === session.id ? "CONFIRMED" : "PENDING",
                },
              })),
            },
          },
        },
      },
    });

    return { isSuccess: true };
  },
);

export const deleteEvent = decorator(
  async (session: SessionUser, eventId: string): Promise<ActionResult> => {
    const event = await prisma.calendarEvent.findFirst({
      where: { id: eventId, request: { requestedById: session.id } },
    });
    if (!event) return { isSuccess: false, message: "삭제 권한이 없습니다." };

    await prisma.calendarEvent.delete({ where: { id: eventId } });

    return { isSuccess: true };
  },
);

export const respondToEvent = decorator(
  async (
    session: SessionUser,
    eventAssigneeId: string,
    status: "CONFIRMED" | "REJECTED",
    comment?: string,
  ): Promise<ActionResult> => {
    await prisma.eventAssignee.update({
      where: { id: eventAssigneeId },
      data: { status, comment, respondedAt: new Date() },
    });

    return { isSuccess: true };
  },
);
