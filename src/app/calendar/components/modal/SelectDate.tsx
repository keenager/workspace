import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEndDateState, useStartDateState } from "../../store/EventProvider";
import { EventInModal } from "../../types";

interface Props {
  event?: EventInModal;
  selectedDate?: Date;
}

export default function SelectDate({ event, selectedDate }: Props) {
  const [startDate, setStartDate] = useStartDateState();
  const [endDate, setEndDate] = useEndDateState();

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
  }, [event, selectedDate]);
  return (
    <>
      <div>
        <DatePopOver label="시작일" date={startDate} setDate={setStartDate} />
      </div>
      <div>
        <DatePopOver label="종료일" date={endDate} setDate={setEndDate} />
      </div>
    </>
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
