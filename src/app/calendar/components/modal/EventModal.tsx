"use client";

import {
  useDeleteHandler,
  useSubmitHandler,
} from "../../hooks/useEventHandler";
import { EventInModal, User } from "../../types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectDate from "./SelectDate";
import SelectAssignees from "./SelectAssignees";
import SelectPriority from "./SelectPriority";
import { deleteEvent } from "../../actions/event";
import ConfirmDialog from "../ConfirmDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { useEffect, useState } from "react";

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
  const [isAllDay, setIsAllDay] = useState(true);

  const [formAction, isSubmitPending] = useSubmitHandler({
    event,
    isAllDay,
    closeModal: onClose,
  });

  const [deleteAction, isDeletePending] = useDeleteHandler({
    event,
    closeModal: onClose,
  });

  const commonProps = { event, selectedDate };

  useEffect(() => {
    setIsAllDay(event?.isAllDay ?? true);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "일정 수정" : "일정 요청"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <Input
              name="title"
              defaultValue={event?.title}
              placeholder="일정 제목"
              required
            />
          </div>
          <Field orientation="horizontal">
            <Checkbox
              id="allDay"
              name="allDay"
              checked={isAllDay}
              onCheckedChange={() => {
                setIsAllDay((prev) => !prev);
              }}
            />
            <FieldLabel htmlFor="allDay" className="text-sm font-medium">
              하루종일
            </FieldLabel>
          </Field>
          <SelectDate {...commonProps} isAllDay={isAllDay} />
          <SelectAssignees {...commonProps} users={users} />
          <SelectPriority event={event} />
          <div>
            <label className="text-sm font-medium">메모</label>
            <Textarea
              name="description"
              defaultValue={event?.description}
              placeholder="메모 또는 설명"
              rows={3}
            />
          </div>
          <DialogFooter className="justify-between!">
            <ConfirmDialog
              title="삭제"
              description={`${event?.title} 일정을 삭제하시겠습니까?`}
              confirmVariant="destructive"
              onConfirm={deleteAction}
              isPending={isDeletePending}
            >
              <Button variant="destructive">삭제</Button>
            </ConfirmDialog>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitPending}>
                {isEdit ? "수정" : "요청"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
