"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventImpl } from "@fullcalendar/core/internal";
import { SessionUser } from "@/lib/auth";
import EventProvider from "../../store/EventProvider";
import EventDetailModal from "../modal/detail-modal/EventDetailModal";
import EventAddEditModal from "../modal/edit-modal/EventAddEditModal";
import { CalendarLegend } from "./CalendarLegend";
import { toCalendarEvents } from "./fromDBtoCalendar";
import { EventFromDB, User } from "../../types";

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
  const router = useRouter();

  const calendarEvents = toCalendarEvents(events, session.id);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        router.refresh();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <CalendarLegend />
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
