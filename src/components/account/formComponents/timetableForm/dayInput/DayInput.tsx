import { DaySchedule, TimeSlot, WeekDay } from "@/types/place/schedule";
import TimeSlotInputs from "../../../../common/timetable/timeSlotInputs/TimeSlotInputs";
import { Edit3, PlusCircle } from "lucide-react";

import Button from "../../../../common/buttons/button/Button";
import { getStrictExcludedTimes } from "@/utils/timetable";
import { useToast } from "@/hooks/useToast";
import styles from "./DayInput.module.scss";

interface DayInputProps {
  day: WeekDay;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}

const DayInput = ({ day, schedule, onChange }: DayInputProps) => {
  const { showError } = useToast();

  const handleToggleOpen = () => {
    onChange({ ...schedule, open: !schedule.open });
  };

  const handleAddTimeSlot = () => {
    const hasIncompleteSlots = () => {
      if (!schedule.timeSlots || schedule.timeSlots.length === 0) {
        return false;
      }
      return schedule.timeSlots.some(
        (slot) => !slot.startTime || !slot.endTime
      );
    };

    if (hasIncompleteSlots()) {
      showError(
        "Veuillez compléter tous les créneaux existants avant d'en ajouter un nouveau"
      );
      return;
    }

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

  const statusTextClass = `${styles.statusText} ${
    schedule?.open ? styles.open : styles.closed
  }`;

  return (
    <div className={styles.dayInput}>
      <label className={styles.dayLabel}>
        <div className={styles.dayHeader}>
          <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
          <div className={styles.statusContainer}>
            <span className={statusTextClass}>
              {schedule?.open ? "Ouvert" : "Fermé"}
            </span>
            <Button onClick={handleToggleOpen} variant="simple" size="small">
              <Edit3 size={16} />
            </Button>
          </div>
        </div>
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
          <Button
            fullWidth
            onClick={handleAddTimeSlot}
            variant="secondary"
            size="small"
            startIcon={<PlusCircle size={16} />}
          >
            Ajouter un créneau
          </Button>
        </div>
      )}
    </div>
  );
};

export default DayInput;
