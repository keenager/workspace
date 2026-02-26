"use client";

import useSubmitHandler from "../../hooks/useSubmitHandler";
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

  const [formAction, isPending] = useSubmitHandler({
    event,
    closeModal: onClose,
  });

  const commonProps = { event, selectedDate };

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
          <SelectDate {...commonProps} />
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
