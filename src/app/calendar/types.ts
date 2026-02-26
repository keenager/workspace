import { Dispatch, SetStateAction } from "react";

export type Schedule = { title: string; start: string; end: string };

export type EventInModal = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  assigneeIds: string[];
};

export type User = { id: string; name: string; email: string };

export type MakeState<T> = [T, Dispatch<SetStateAction<T>>];
