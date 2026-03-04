"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SessionUser } from "@/lib/auth";
import EventProvider from "../store/EventProvider";
import EventAddEditModal from "./modal/edit-modal/EventAddEditModal";
import { EventForFullCalendar, EventFromDB, User } from "../types";
import EventDetailModal from "./modal/detail-modal/EventDetailModal";
import { EventImpl } from "@fullcalendar/core/internal";

interface Props {
  session: SessionUser;
  events: EventFromDB[];
  users: User[];
}

export default function CalendarClient({ session, events, users }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EventImpl>();
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const calendarEvents = toCalendarEvents(events, session.id);
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={calendarEvents}
        dateClick={(arg) => {
          setSelectedEvent(undefined);
          setSelectedDate(arg.date);
          setAddEditModalOpen(true);
        }}
        eventClick={(arg) => {
          setSelectedDate(undefined);
          setSelectedEvent(arg.event);
          setDetailModalOpen(true);
        }}
        eventMouseEnter={(arg) => {}}
        height="auto"
      />
      <EventProvider event={selectedEvent} selectedDate={selectedDate}>
        <EventAddEditModal
          isOpen={addEditModalOpen}
          event={selectedEvent}
          selectedDate={selectedDate}
          users={users}
          onClose={() => setAddEditModalOpen(false)}
        />
      </EventProvider>
      <EventDetailModal
        session={session}
        event={selectedEvent}
        open={detailModalOpen}
        setModalOpen={[setAddEditModalOpen, setDetailModalOpen] as const}
      />
    </>
  );
}

const toCalendarEvents = (
  events: EventFromDB[],
  currentUserId: string,
): EventForFullCalendar[] => {
  return events.map((event) => {
    const myAssignee = event.request?.assignees?.find(
      (a) => a.userId === currentUserId,
    );
    const allConfirmed = event.request?.assignees?.every(
      (a) => a.status === "CONFIRMED",
    );
    const color = allConfirmed
      ? "#22c55e" // 전원 확정 → 초록
      : myAssignee?.status === "PENDING"
        ? "#94a3b8" // 내가 아직 미확인 → 회색
        : "#3b82f6"; // 일부 확정 → 파랑

    return {
      id: event.id,
      title: event.title,
      allDay: event.allDay,
      start: event.startDate,
      end: event.endDate,
      backgroundColor: color,
      borderColor: color,
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
