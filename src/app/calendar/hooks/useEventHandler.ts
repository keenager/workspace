import { startTransition, useActionState, useEffect } from "react";
import {
  ActionResult,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../actions/event";
import { toast } from "sonner";
import { EventInModal } from "../types";
import {
  useAssignState,
  useEndDateState,
  useStartDateState,
} from "../store/EventProvider";

interface Props {
  event?: EventInModal;
  isAllDay?: boolean;
  closeModal: () => void;
}

export const useSubmitHandler = ({ event, isAllDay, closeModal }: Props) => {
  const [startDate] = useStartDateState();
  const [endDate] = useEndDateState();
  const [assigneeIds] = useAssignState();

  const action = async (_: ActionResult, formData: FormData) => {
    // title, priority, description 은 있음.

    // 시작일
    if (!isAllDay) {
      const [hour, min] =
        formData.get("startTime")?.toString().split(":").map(Number) ?? [];
      startDate.setHours(hour, min);
    }
    formData.set("startDate", startDate.toISOString());

    // 종료일
    if (isAllDay) {
      endDate.setDate(endDate.getDate() + 1); //fullCalendar에서 end는 exlusive
    } else {
      const [hour, min] =
        formData.get("endTime")?.toString().split(":").map(Number) ?? [];
      endDate.setHours(hour, min);
    }
    formData.set("endDate", endDate.toISOString());

    // 담당자
    assigneeIds.forEach((id) => formData.append("assigneeIds", id));

    if (!!event) return await updateEvent(event.id, formData);
    else return await createEvent(formData);
  };

  const [state, formAction, isPending] = useActionState(action, {
    isSuccess: false,
  });

  useEffect(() => {
    if (state.isSuccess) {
      closeModal();
      toast("저장하였습니다.");
    } else {
      toast(state.message);
    }
  }, [state]);

  return [formAction, isPending] as const;
};

export const useDeleteHandler = ({ event, closeModal }: Props) => {
  const action = async () => {
    return await deleteEvent(event!.id);
  };

  const [state, deleteAction, isPending] = useActionState(action, {
    isSuccess: false,
  });

  const deleteHandler = () => {
    startTransition(() => {
      deleteAction();
    });
  };

  useEffect(() => {
    if (state.isSuccess) {
      closeModal();
      toast("삭제하였습니다.");
    } else {
      toast(state.message);
    }
  }, [state]);

  return [deleteHandler, isPending] as const;
};
