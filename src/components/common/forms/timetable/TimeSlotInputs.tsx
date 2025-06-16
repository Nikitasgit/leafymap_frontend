import React from "react";
import Text from "@/components/common/typography/Text";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { EventTimeSlot, TimeSlot } from "@/types/place/schedule";

registerLocale("fr", fr);

interface TimeSlotInputsProps {
  slot: TimeSlot | EventTimeSlot;
  onRemove: () => void;
  onTimeChange: (field: keyof TimeSlot, value: Date | string | null) => void;
  getExcludedTimes: (isStartTime: boolean) => Date[];
}

const TimeSlotInputs: React.FC<TimeSlotInputsProps> = ({
  slot,
  onRemove,
  onTimeChange,
  getExcludedTimes = () => [],
}) => {
  const parseTimeString = (timeString: string): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div>
      <DatePicker
        selected={parseTimeString(slot.startTime)}
        onChange={(time) => onTimeChange("startTime", time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={10}
        timeCaption="Heure"
        dateFormat="HH:mm"
        placeholderText="Heure de début"
        locale="fr"
        className="time-picker"
        excludeTimes={getExcludedTimes(true)}
        onKeyDown={(e) => e.preventDefault()}
        minTime={new Date(new Date().setHours(0, 0, 0))}
        maxTime={
          slot.endTime
            ? parseTimeString(slot.endTime)!
            : new Date(new Date().setHours(23, 59, 0))
        }
      />
      <Text>à</Text>
      <DatePicker
        selected={parseTimeString(slot.endTime)}
        onChange={(time) => onTimeChange("endTime", time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={10}
        timeCaption="Heure"
        dateFormat="HH:mm"
        placeholderText="Heure de fin"
        locale="fr"
        minTime={
          slot.startTime
            ? parseTimeString(slot.startTime)!
            : new Date(new Date().setHours(0, 0, 0))
        }
        maxTime={new Date(new Date().setHours(23, 59, 0))}
        className="time-picker"
        excludeTimes={getExcludedTimes(false)}
        onKeyDown={(e) => e.preventDefault()}
      />
      <button type="button" onClick={onRemove}>
        ❌
      </button>
    </div>
  );
};

export default TimeSlotInputs;
