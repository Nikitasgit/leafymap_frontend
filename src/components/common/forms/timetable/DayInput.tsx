import { DaySchedule, TimeSlot, WeekDay } from "@/types/place/schedule";
import TimeSlotInputs from "./TimeSlotInputs";

import Button from "../../buttons/button/Button";
import { getStrictExcludedTimes } from "@/utils/timetable";

interface DayInputProps {
  day: WeekDay;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}

const DayInput = ({ day, schedule, onChange }: DayInputProps) => {
  const handleToggleOpen = () => {
    onChange({ ...schedule, open: !schedule.open });
  };

  const handleAddTimeSlot = () => {
    const newTimeSlot: TimeSlot = {
      startTime: "",
      endTime: "",
    };
    onChange({
      ...schedule,
      timeSlots: [...(schedule.timeSlots || []), newTimeSlot],
    });
  };

  const handleTimeChange = (
    index: number,
    field: keyof TimeSlot,
    value: Date | string | null
  ) => {
    if (!value) return;

    let timeString: string;
    if (value instanceof Date) {
      timeString = value.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      timeString = value;
    }

    const updatedTimeSlots = [...(schedule.timeSlots || [])];
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: timeString,
    };
    onChange({ ...schedule, timeSlots: updatedTimeSlots });
  };

  const handleRemoveSlot = (index: number) => {
    const updatedTimeSlots =
      schedule.timeSlots?.filter((_, i) => i !== index) || [];
    onChange({ ...schedule, timeSlots: updatedTimeSlots });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={schedule.open}
          onChange={handleToggleOpen}
        />
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </label>

      {schedule.open && (
        <div style={{ marginLeft: "20px", marginTop: "8px" }}>
          {schedule.timeSlots?.map((slot, index) => (
            <TimeSlotInputs
              key={index}
              slot={slot}
              onTimeChange={(field, value) =>
                handleTimeChange(index, field, value)
              }
              onRemove={() => handleRemoveSlot(index)}
              getExcludedTimes={(isStartTime) =>
                getStrictExcludedTimes(isStartTime, index, schedule)
              }
            />
          ))}
          <Button onClick={handleAddTimeSlot}>➕ Ajouter un créneau</Button>
        </div>
      )}
    </div>
  );
};

export default DayInput;
