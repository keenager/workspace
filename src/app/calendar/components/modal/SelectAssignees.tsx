import { useEffect, useState } from "react";
import { useAssignState } from "../../store/EventProvider";
import { EventInModal, User } from "../../types";

interface Props {
  event?: EventInModal;
  selectedDate?: Date;
  users: User[];
}

export default function SelectAssignees({ event, selectedDate, users }: Props) {
  const [assigneeIds, setAssigneeIds] = useAssignState();

  useEffect(() => {
    setAssigneeIds(event?.assigneeIds ?? []);
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
