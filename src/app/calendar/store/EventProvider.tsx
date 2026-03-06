import { createContext, ReactNode, useContext, useState } from "react";
import { EventForFullCalendar, ExtendedProps, MakeState } from "../types";
import { EventImpl } from "@fullcalendar/core/internal";

interface Props {
  event?: EventImpl | EventForFullCalendar;
  selectedDate?: Date;
  children: ReactNode;
}

const StartDateContext = createContext<MakeState<Date>>([new Date(), () => {}]);
const EndDateContext = createContext<MakeState<Date>>([new Date(), () => {}]);
const AssigneeIdsContext = createContext<MakeState<string[]>>([[], () => {}]);

export default function EventProvider({
  event,
  selectedDate,
  children,
}: Props) {
  const startState = useState(event?.start ?? selectedDate ?? new Date());
  const endState = useState(event?.end ?? selectedDate ?? new Date());
  const assignees = (event?.extendedProps as ExtendedProps)?.assignees ?? [];
  const assigneeIdsState = useState(assignees?.map((a) => a.userId) ?? []);

  return (
    <StartDateContext.Provider value={startState}>
      <EndDateContext.Provider value={endState}>
        <AssigneeIdsContext value={assigneeIdsState}>
          {children}
        </AssigneeIdsContext>
      </EndDateContext.Provider>
    </StartDateContext.Provider>
  );
}

export const useStartDateState = () => {
  return useContext(StartDateContext);
};

export const useEndDateState = () => {
  return useContext(EndDateContext);
};

export const useAssignState = () => {
  return useContext(AssigneeIdsContext);
};
