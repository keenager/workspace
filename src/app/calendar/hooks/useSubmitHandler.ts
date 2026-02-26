import { useActionState, useEffect } from "react";
import { ActionResult, createEvent, updateEvent } from "../actions/event";
import { toast } from "sonner";
import { EventInModal } from "../types";
import {
  useAssignState,
  useEndDateState,
  useStartDateState,
} from "../store/EventProvider";

interface Props {
  event?: EventInModal;
  closeModal: () => void;
}

const useSubmitHandler = ({ event, closeModal }: Props) => {
  const [startDate] = useStartDateState();
  const [endDate] = useEndDateState();
  const [assigneeIds] = useAssignState();

  const action = async (_: ActionResult, formData: FormData) => {
    // title, priority, description 은 있음.
    // 시작일
    formData.set("startDate", startDate.toISOString());
    // 종료일
    endDate.setDate(endDate.getDate() + 1); //fullCalendar에서 end는 exlusive
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

export default useSubmitHandler;
