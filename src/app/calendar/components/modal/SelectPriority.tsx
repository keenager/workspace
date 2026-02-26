import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventInModal } from "../../types";

interface Props {
  event?: EventInModal;
}

export default function SelectPriority({ event }: Props) {
  const [priority, setPriority] = useState(event?.priority ?? "NORMAL");

  return (
    <div>
      <label className="text-sm font-medium">우선 순위</label>
      <Select name="priority" value={priority} onValueChange={setPriority}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="URGENT">긴급</SelectItem>
          <SelectItem value="NORMAL">보통</SelectItem>
          <SelectItem value="LOW">낮음</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
