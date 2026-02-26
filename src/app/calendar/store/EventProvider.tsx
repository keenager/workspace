import { createContext, ReactNode, useContext, useState } from "react";
import { EventInModal, MakeState } from "../types";

interface Props {
  event?: EventInModal;
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
  const startState = useState(event?.startDate ?? selectedDate ?? new Date());
  const endState = useState(event?.endDate ?? selectedDate ?? new Date());
  const assigneeIdsState = useState(event?.assigneeIds ?? []);

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
