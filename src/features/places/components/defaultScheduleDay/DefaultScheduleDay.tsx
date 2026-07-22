import { TimeSlot } from "../../types/schedule";
import TimeSlotInputs from "@/features/places/components/timeSlotInputs";
import { Edit3, PlusCircle } from "lucide-react";

import Button from "@/shared/ui/buttons/button";
import { getStrictExcludedTimes } from "../../utils/timetable";
import { useToast } from "@/shared/hooks/useToast";
import styles from "./DefaultScheduleDay.module.scss";
import { DefaultScheduleDayProps } from "./DefaultScheduleDay.types";
import { useTranslation } from "react-i18next";

const DefaultScheduleDay = ({
  day,
  schedule,
  onChange,
}: DefaultScheduleDayProps) => {
  const { showError } = useToast();
  const { t } = useTranslation("account");
  const handleToggleOpen = () => {
    onChange({ ...schedule, open: !schedule.open });
  };

  const handleAddTimeSlot = () => {
    const hasIncompleteSlots = () => {
      if (!schedule.timeSlots || schedule.timeSlots.length === 0) {
        return false;
      }
      return schedule.timeSlots.some(
        (slot) => !slot.startTime || !slot.endTime,
      );
    };

    if (hasIncompleteSlots()) {
      showError(t("defaultScheduleDay.incompleteSlotsError"));
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
    value: Date | string | null,
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
          {t(`common:defaultSchedule.day.${day}`)}
        </span>
        <div className={styles.statusContainer}>
          <span className={statusTextClass}>
            {schedule?.open
              ? t("common:defaultSchedule.open")
              : t("common:defaultSchedule.closed")}
          </span>
          <Button
            onClick={handleToggleOpen}
            variant="simple"
            size="small"
            ariaLabel={t("defaultScheduleDay.editStatusAriaLabel")}
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
            ariaLabel={t("defaultScheduleDay.addSlotAriaLabel")}
            aria-disabled={!schedule.open}
            onClick={handleAddTimeSlot}
            variant="secondary"
            size="small"
            startIcon={<PlusCircle size={16} />}
          >
            {t("defaultScheduleDay.addSlot")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DefaultScheduleDay;
