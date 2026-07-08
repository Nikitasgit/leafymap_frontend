import { TimeSlot } from "@/types/place/schedule";
import TimeSlotInputs from "../../../common/inputs/TimeSlotInputs";
import { Edit3, PlusCircle } from "lucide-react";

import Button from "../../../common/buttons/Button";
import { getStrictExcludedTimes } from "@/utils/timetable";
import { useToast } from "@/hooks/useToast";
import styles from "./DefaultScheduleDay.module.scss";
import { DefaultScheduleDayProps } from "./DefautlScheduleDay.types";
import { useTranslation } from "react-i18next";

const DefaultScheduleDay = ({
  day,
  schedule,
  onChange,
}: DefaultScheduleDayProps) => {
  const { showError } = useToast();
  const { t } = useTranslation();
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
      <div className={styles.dayHeader}>
        <span className={styles.dayName}>
          {t(`defaultSchedule.day.${day}`)}
        </span>
        <div className={styles.statusContainer}>
          <span className={statusTextClass}>
            {schedule?.open ? "Ouvert" : "Fermé"}
          </span>
          <Button
            onClick={handleToggleOpen}
            variant="simple"
            size="small"
            ariaLabel="Modifier l'état"
          >
            <Edit3 size={16} />
          </Button>
        </div>
      </div>

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
                canRemove={true}
              />
            ))}
          </div>
          <Button
            fullWidth
            disabled={!schedule.open}
            ariaLabel="Ajouter un créneau"
            aria-disabled={!schedule.open}
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

export default DefaultScheduleDay;
