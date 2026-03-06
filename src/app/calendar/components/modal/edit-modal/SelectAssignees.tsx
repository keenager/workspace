import { useEffect, useState } from "react";
import { useAssignState } from "../../../store/EventProvider";
import { EventForFullCalendar, ExtendedProps, User } from "../../../types";
import { EventImpl } from "@fullcalendar/core/internal";

interface Props {
  event?: EventImpl | EventForFullCalendar;
  selectedDate?: Date;
  users: User[];
}

export default function SelectAssignees({ event, selectedDate, users }: Props) {
  const [assigneeIds, setAssigneeIds] = useAssignState();

  useEffect(() => {
    const assignees = (event?.extendedProps as ExtendedProps)?.assignees ?? [];
    const newIds = assignees?.map((a) => a.userId);
    setAssigneeIds(newIds ?? []);
  }, [event, selectedDate]);

  const toggleAssignee = (userId: string) => {
    setAssigneeIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <div>
      <label className="text-sm font-medium">담당자</label>
      <div className="flex gap-2 mt-1 flex-wrap">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={toggleAssignee.bind(null, user.id)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              assigneeIds.includes(user.id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border"
            }`}
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
}
