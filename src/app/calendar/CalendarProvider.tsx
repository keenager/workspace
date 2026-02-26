"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { MakeState } from "../../../../my-nextjs-site/app/hayul/point/types";
import { Schedule } from "./types";

type DateState = [string, Dispatch<SetStateAction<string>>];
const initialStatus: DateState = ["", () => {}];
const DateContext = createContext<DateState>(initialStatus);

type ScheduleState = MakeState<Schedule[]>;
const ScheduleContext = createContext<ScheduleState>([[], () => {}]);

export default function CalendarProvider({
  children,
}: {
  children: ReactNode;
}) {
  // const scheduleState = useState<Schedule[]>(scheduleList);
  const dateState = useState<string>("");

  return (
    // <ScheduleContext value={scheduleState}>
    <DateContext.Provider value={dateState}>{children}</DateContext.Provider>
    // </ScheduleContext>
  );
}

export const useDateCtx = () => {
  return useContext(DateContext);
};

export const useScheduleCtx = () => {
  return useContext(ScheduleContext);
};
