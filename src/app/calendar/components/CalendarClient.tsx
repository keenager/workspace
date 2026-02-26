"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SessionUser } from "@/lib/auth";
import EventProvider from "../store/EventProvider";
import EventModal from "./modal/EventModal";
import { EventInModal, User } from "../types";

interface Props {
  session: SessionUser;
  events: any[];
  users: User[];
}

export default function CalendarClient({ session, events, users }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EventInModal>();
  const [modalOpen, setModalOpen] = useState(false);
  const calendarEvents = toCalendarEvents(events, session.id);
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={calendarEvents}
        dateClick={(arg) => {
          setSelectedEvent(undefined);
          setSelectedDate(arg.date);
          setModalOpen(true);
        }}
        eventClick={(arg) => {
          const e = arg.event;
          setSelectedDate(undefined);
          setSelectedEvent({
            id: e.id,
            title: e.title,
            description: e.extendedProps.description,
            startDate: e.start!,
            endDate: e.end || e.start!, //FullCalendar에서 end 날짜는 이벤트 기간에 포함되지 않습니다. 만약 start와 end가 같다면 기간이 0이 되므로, FullCalendar는 이를 "종료일이 없는 이벤트"로 간주하고 end를 null로 처리
            priority: e.extendedProps.priority,
            assigneeIds:
              e.extendedProps.assignees?.map((a: any) => a.userId) ?? [],
          });
          setModalOpen(true);
        }}
        eventMouseEnter={(arg) => {}}
        height="auto"
      />
      <EventProvider event={selectedEvent} selectedDate={selectedDate}>
        <EventModal
          isOpen={modalOpen}
          event={selectedEvent}
          selectedDate={selectedDate}
          users={users}
          onClose={() => setModalOpen(false)}
        />
      </EventProvider>
    </div>
  );
}

const toCalendarEvents = (events: any[], currentUserId: string) => {
  return events.map((event) => {
    const myAssignee = event.request?.assignees?.find(
      (a: any) => a.userId === currentUserId,
    );
    const allConfirmed = event.request?.assignees?.every(
      (a: any) => a.status === "CONFIRMED",
    );
    const color = allConfirmed
      ? "#22c55e" // 전원 확정 → 초록
      : myAssignee?.status === "PENDING"
        ? "#94a3b8" // 내가 아직 미확인 → 회색
        : "#3b82f6"; // 일부 확정 → 파랑

    return {
      id: event.id,
      title: event.title,
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
