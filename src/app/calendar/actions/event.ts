"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { CalendarEvent } from "../../../../generated/prisma/client";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  isSuccess: boolean;
  message?: string;
  eventId?: string;
};

export const createEvent = async (
  formData: FormData,
): Promise<ActionResult> => {
  const session = await getSession();
  if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };

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

  revalidatePath("/calendar");
  return { isSuccess: true, eventId: event.id };
};

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

export const updateEvent = async (
  eventId: string,
  formData: FormData,
): Promise<ActionResult> => {
  const session = await getSession();
  if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };

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
                requestId_userId: { requestId: event.request!.id, userId: id },
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

  revalidatePath("/calendar");
  return { isSuccess: true };
};

export const deleteEvent = async (eventId: string): Promise<ActionResult> => {
  const session = await getSession();
  if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };

  const event = await prisma.calendarEvent.findFirst({
    where: { id: eventId, request: { requestedById: session.id } },
  });
  if (!event) return { isSuccess: false, message: "삭제 권한이 없습니다." };

  await prisma.calendarEvent.delete({ where: { id: eventId } });

  revalidatePath("/calendar");
  return { isSuccess: true };
};

export const respondToEvent = async (
  eventAssigneeId: string,
  status: "CONFIRMED" | "REJECTED",
  comment?: string,
): Promise<ActionResult> => {
  const session = await getSession();
  if (!session) return { isSuccess: false, message: "로그인이 필요합니다." };

  await prisma.eventAssignee.update({
    where: { id: eventAssigneeId },
    data: { status, comment, respondedAt: new Date() },
  });

  revalidatePath("/calendar");
  return { isSuccess: true };
};
