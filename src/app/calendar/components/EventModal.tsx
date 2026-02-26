"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { ActionResult, createEvent, updateEvent } from "../actions/event";
import { EventInModal } from "../types";

type User = { id: string; name: string; email: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  selectedDate?: Date;
  event?: EventInModal;
}

export default function EventModal({
  isOpen,
  onClose,
  users,
  selectedDate,
  event,
}: Props) {
  const isEdit = !!event;

  const [startDate, setStartDate] = useState(
    event?.startDate ?? selectedDate ?? new Date(),
  );
  const [endDate, setEndDate] = useState(
    event?.endDate ?? selectedDate ?? new Date(),
  );
  useEffect(() => {
    setStartDate(event?.startDate ?? selectedDate ?? new Date());
    setEndDate((_) => {
      let endDate: Date | undefined;
      if (event) {
        endDate = new Date(event.endDate);
        endDate.setDate(endDate.getDate() - 1);
      } else {
        endDate = undefined;
      }
      return endDate ?? selectedDate ?? new Date();
    });
    setAssigneeIds(event?.assigneeIds ?? []);
  }, [event, selectedDate]);

  const [assigneeIds, setAssigneeIds] = useState(event?.assigneeIds ?? []);
  console.log("assigneeIds: ", assigneeIds);
  const [priority, setPriority] = useState(event?.priority ?? "NORMAL");

  const toggleAssignee = (userId: string) => {
    setAssigneeIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const [isPending, startSubmit] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startSubmit(async () => {
      formData.set("startDate", startDate.toISOString());
      endDate.setDate(endDate.getDate() + 1); //fullCalendar에서 end는 exlusive
      formData.set("endDate", endDate.toISOString());
      assigneeIds.forEach((id) => formData.append("assigneeIds", id));
      formData.set("priority", priority);
      if (isEdit) await updateEvent(event.id, formData);
      else await createEvent(formData);
    });
    onClose();
  };

  // const action = async (prevState: ActionResult, formData: FormData) => {
  //   formData.set("startDate", startDate.toISOString());
  //   formData.set("endDate", endDate.toISOString());
  //   assigneeIds.forEach((id) => formData.append("assigneeIds", id));
  //   formData.set("priority", priority);
  //   console.log("formData: ", formData);
  //   if (isEdit) return await updateEvent(event.id, formData);
  //   else return await createEvent(formData);
  // };

  // const [state, formAction, isPending] = useActionState(
  //   action,
  //   {} as ActionResult,
  // );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "일정 수정" : "일정 요청"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <Input
              name="title"
              defaultValue={event?.title}
              placeholder="일정 제목"
              required
            />
          </div>
          <div>
            <DatePopOver
              label="시작일"
              date={startDate}
              setDate={setStartDate}
            />
          </div>
          <div>
            <DatePopOver label="종료일" date={endDate} setDate={setEndDate} />
          </div>
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
          <div>
            <label className="text-sm font-medium">우선 순위</label>
            <Select value={priority} onValueChange={setPriority}>
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
          <div>
            <label className="text-sm font-medium">메모</label>
            <Textarea
              name="description"
              defaultValue={event?.description}
              placeholder="메모 또는 설명"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEdit ? "수정" : "요청"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DatePopOverProps {
  label: string;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

function DatePopOver({ label, date, setDate }: DatePopOverProps) {
  return (
    <>
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {date.toLocaleDateString()}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
