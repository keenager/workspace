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
  extendedProps: {
    description: string | null;
    priority: Priority;
    requestedBy?: SimpleUser;
    assignees?: (EventAssignee & { user: SimpleUser })[];
    myAssigneeId?: string;
    myStatus?: EventStatus;
  };
};

export type ExtendedProps = {
  description: string | null;
  priority: Priority;
  requestedBy?: SimpleUser;
  assignees?: (EventAssignee & { user: SimpleUser })[];
  myAssigneeId?: string;
  myStatus?: EventStatus;
};

// export type EventInModal = {
//   id: string;
//   title: string;
//   isAllDay: boolean;
//   description?: string | null;
//   startDate: Date;
//   endDate: Date;
//   priority: Priority;
//   requestedBy?: { id: string; name: string };
//   assignees?: EventAssignee[];
//   assigneeIds: string[];
// };

export type User = { id: string; name: string; email: string };

export type MakeState<T> = [T, Dispatch<SetStateAction<T>>];
