import { Dispatch, SetStateAction } from "react";
import { EventStatus, Priority } from "@/../generated/prisma/enums";
import {
  CalendarEvent,
  EventAssignee,
  EventRequest,
} from "../../../generated/prisma/client";

type SimpleUser = { id: string; name: string };

export type Assignee = EventAssignee & { user: SimpleUser };

export interface EventFromDB extends CalendarEvent {
  request:
    | (EventRequest & {
        requestedBy: SimpleUser;
        assignees: Assignee[];
      })
    | null;
}

export type EventForFullCalendar = {
  id: string;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
  extendedProps: ExtendedProps;
};

export type ExtendedProps = {
  description: string | null;
  priority: Priority;
  requestedBy?: SimpleUser;
  assignees?: (EventAssignee & { user: SimpleUser })[];
  myAssigneeId?: string;
  myStatus?: EventStatus;
};

export type User = { id: string; name: string; email: string };

export type MakeState<T> = [T, Dispatch<SetStateAction<T>>];
