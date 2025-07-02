import { DaySchedule, TimeSlot, WeekDay } from "@/types/place/schedule";
import TimeSlotInputs from "../../../../common/forms/timetable/TimeSlotInputs";

import Button from "../../../../common/buttons/button/Button";
import { getStrictExcludedTimes } from "@/utils/timetable";
import styles from "./DayInput.module.scss";

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
    <div className={styles.dayInput}>
      <label className={styles.dayLabel}>
        <input
          type="checkbox"
          checked={schedule?.open}
          onChange={handleToggleOpen}
        />
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </label>

      {schedule.open && (
        <div className={styles.dayContent}>
          <div className={styles.timeSlotsContainer}>
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
          </div>
          <Button onClick={handleAddTimeSlot} className={styles.addSlotButton}>
            ➕ Ajouter un créneau
          </Button>
        </div>
      )}
    </div>
  );
};

export default DayInput;
