import { EventFromDB } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type PendingMode = "ByMe" | "ByOthers";

interface Props {
  currentUserId: string;
  events: EventFromDB[];
  onEventClick: (eventId: string) => void;
}

export default function PendingNotifications({
  currentUserId,
  events,
  onEventClick,
}: Props) {
  const pendingByMeEvents = events.filter((e) =>
    e.request?.assignees.some(
      (a) => a.user.id === currentUserId && a.status === "PENDING",
    ),
  );

  const pendingByOthersEvents = events.filter(
    (e) =>
      e.request?.requestedBy.id === currentUserId &&
      e.request.assignees.some(
        (a) => a.status === "PENDING" || a.status === "REJECTED",
      ),
  );

  return (
    <div className="flex gap-3">
      <Notification
        pendingMode="ByMe"
        pendingEvents={pendingByMeEvents}
        onEventClick={onEventClick}
      />
      <Notification
        pendingMode="ByOthers"
        pendingEvents={pendingByOthersEvents}
        onEventClick={onEventClick}
      />
    </div>
  );
}

const makeLabelOf = (mode: PendingMode, event: EventFromDB) => {
  if (mode === "ByMe") {
    return `${event.request?.requestedBy.name} 요청 · ${format(new Date(event.startDate), "PPP", { locale: ko })}`;
  } else {
    const theOthers = event.request?.assignees
      .filter((a) => a.status === "PENDING" || a.status === "REJECTED")
      .map((a) => a.user.name)
      .join(", ");
    return `${format(new Date(event.startDate), "PPP", { locale: ko })} 요청 · 미확정 또는 거절 담당자: ${theOthers}`;
  }
};

function Notification({
  pendingMode,
  pendingEvents,
  onEventClick,
}: {
  pendingMode: PendingMode;
  pendingEvents: EventFromDB[];
  onEventClick: (eventId: string) => void;
}) {
  const count = pendingEvents.length;
  if (count === 0) return null;

  const title =
    pendingMode === "ByMe" ? "미확인 요청" : "나의 요청 중 대기 또는 거절 상태";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <BellIcon className="w-4 h-4" />
          <span className="ml-2">{title}</span>
          {/* 숫자 배지 */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <p className="text-sm font-medium">
            {title} {count}건
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {pendingEvents.map((event) => (
            <button
              key={event.id}
              className="w-full text-left px-3 py-2 hover:bg-muted transition-colors border-b last:border-0"
              onClick={() => onEventClick(event.id)}
            >
              <p className="text-sm font-medium truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {makeLabelOf(pendingMode, event)}
              </p>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
