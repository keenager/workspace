import { Dispatch, SetStateAction } from "react";
import { EventStatus, Priority } from "@/../generated/prisma/enums";

export type Schedule = { title: string; start: string; end: string };

export type Event = {
  id: string;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    description: string;
    priority: Priority;
    requestedBy: string;
    assignees: string[];
    myAssigneeId: string;
    myStatus: EventStatus;
  };
};

export type EventInModal = {
  id: string;
  title: string;
  isAllDay: boolean;
  description?: string;
  startDate: Date;
  endDate: Date;
  priority: Priority;
  assigneeIds: string[];
};

export type User = { id: string; name: string; email: string };

export type MakeState<T> = [T, Dispatch<SetStateAction<T>>];
