import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEndDateState, useStartDateState } from "../../store/EventProvider";
import { EventInModal } from "../../types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface Props {
  event?: EventInModal;
  selectedDate?: Date;
  isAllDay: boolean;
}

export default function SelectDate({ event, selectedDate, isAllDay }: Props) {
  const [startDate, setStartDate] = useStartDateState();
  const [endDate, setEndDate] = useEndDateState();

  useEffect(() => {
    setStartDate(event?.startDate ?? selectedDate ?? new Date());
    setEndDate((_) => {
      let endDate: Date | undefined;
      if (event) {
        endDate = new Date(event.endDate);
        if (event.isAllDay) {
          endDate.setDate(endDate.getDate() - 1);
        }
      } else {
        endDate = undefined;
      }
      return endDate ?? selectedDate ?? new Date();
    });
  }, [event, selectedDate]);

  return (
    <>
      <FieldGroup className="mx-auto flex-row">
        <DatePicker
          label="시작일"
          id="startDatePicker"
          date={startDate}
          setDate={setStartDate}
        />
        {!isAllDay && (
          <TimePicker
            label="시작 시각"
            id="startTimePicker"
            name="startTime"
            time={event && !event.isAllDay ? getTimeFrom(startDate) : undefined}
          />
        )}
      </FieldGroup>
      <FieldGroup className="mx-auto flex-row">
        <DatePicker
          label="종료일"
          id="endDatePicker"
          date={endDate}
          setDate={setEndDate}
        />
        {!isAllDay && (
          <TimePicker
            label="종료 시각"
            id="endTimePicker"
            name="endTime"
            time={event && !event.isAllDay ? getTimeFrom(endDate) : undefined}
          />
        )}
      </FieldGroup>
    </>
  );
}

interface DatePickerProps {
  label: string;
  id: string;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

function DatePicker({ label, id, date, setDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id={id} variant="outline" className="w-full justify-start">
            {date.toLocaleDateString()}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              date && setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

interface TimePickerProps {
  label: string;
  id: string;
  name: string;
  time?: string;
}

function TimePicker({ label, id, name, time }: TimePickerProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        type="time"
        id={id}
        name={name}
        step="1"
        defaultValue={time ?? "10:00:00"}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </Field>
  );
}

function getTimeFrom(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${mins}`;
}
