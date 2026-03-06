import styles from "./CalendarClient.module.css";
import { EventStatus } from "../../../../../generated/prisma/enums";
import { EventForFullCalendar, EventFromDB } from "../../types";

const PRIORITY_COLORS = {
  URGENT: "#ef4444", //red
  NORMAL: "#3b82f6", //blue
  LOW: "#94a3b8", //grey
} as const;

export const toCalendarEvents = (
  events: EventFromDB[],
  currentUserId: string,
): EventForFullCalendar[] => {
  return events.map((event) => {
    const assignees = event.request?.assignees ?? [];
    const myAssignee = assignees.find((a) => a.userId === currentUserId);
    const isRequester = event.request?.requestedBy.id === currentUserId;

    //전체 상태
    const allConfirmed = assignees.every((a) => a.status === "CONFIRMED");
    const allDone = assignees.every((a) => a.status === "DONE");
    const hasRejected = assignees.some((a) => a.status === "REJECTED");
    const hasPending = assignees.some((a) => a.status === "PENDING");

    //표시할 status
    const displayStatus: EventStatus = isRequester
      ? allDone
        ? "DONE"
        : allConfirmed
          ? "CONFIRMED"
          : hasRejected
            ? "REJECTED"
            : "PENDING"
      : (myAssignee?.status ?? "PENDING");

    // const myStatus = myAssignee?.status ?? "PENDING";
    const priority = event.priority;
    const baseColor = PRIORITY_COLORS[priority];

    // status에 따라 스타일 조정
    const isPending = displayStatus === "PENDING";
    const isRejected = displayStatus === "REJECTED";
    const isDone = displayStatus === "DONE";

    return {
      id: event.id,
      title: event.title,
      allDay: event.allDay,
      start: event.startDate,
      end: event.endDate,
      backgroundColor:
        isRejected || isDone
          ? `${baseColor}66` //반투명
          : isPending
            ? `${baseColor}99` //약간 투명
            : baseColor, //확정이면 불투명
      borderColor: baseColor,
      classNames: [
        isPending ? styles.eventPending : "",
        isRejected ? styles.eventRejected : "",
        isDone ? styles.eventDone : "",
      ].filter(Boolean),
      extendedProps: {
        description: event.description,
        priority: event.priority,
        requestedBy: event.request?.requestedBy,
        assignees: event.request?.assignees,
        myAssigneeId: myAssignee?.id,
        myStatus: myAssignee?.status,
      },
    };
  });
};
