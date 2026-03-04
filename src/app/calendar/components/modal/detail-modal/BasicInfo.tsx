import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { EventImpl } from "@fullcalendar/core/internal";
import { ExtendedProps } from "@/app/calendar/types";

const priorityLabel = {
  URGENT: "긴급",
  NORMAL: "보통",
  LOW: "낮음",
};

interface Props {
  event: EventImpl; // 부모 컴포넌트에서 undefined인 경우 처리했음.
}

export default function BasicInfo({ event }: Props) {
  const displayEnd = event.allDay
    ? (() => {
        const d = new Date(event.end!);
        d.setDate(d.getDate() - 1);
        return d;
      })()
    : event.end!;

  const { requestedBy, priority, description } =
    event.extendedProps as ExtendedProps;

  return (
    <div className="space-y-1 text-sm">
      <p>
        <span className="font-medium">기간: </span>
        {format(event.start!, "PPP", { locale: ko })}
        {" ~ "}
        {format(displayEnd, "PPP", { locale: ko })}
      </p>
      <p>
        <span className="font-medium">우선순위: </span>
        {priorityLabel[priority]}
      </p>
      <p>
        <span className="font-medium">요청자: </span>
        {requestedBy?.name}
      </p>
      {description && (
        <p>
          <span className="font-medium">메모: </span>
          {description}
        </p>
      )}
    </div>
  );
}
