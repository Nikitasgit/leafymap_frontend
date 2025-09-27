import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { EventTimeSlot, TimeSlot } from "@/types/place/schedule";
import styles from "./TimeSlotInputs.module.scss";
import { XCircle } from "lucide-react";
import Button from "../../buttons/button/Button";

registerLocale("fr", fr);

interface TimeSlotInputsProps {
  slot: TimeSlot | EventTimeSlot;
  onRemove: () => void;
  onTimeChange: (field: keyof TimeSlot, value: Date | string | null) => void;
  getExcludedTimes: (isStartTime: boolean) => Date[];
  canRemove: boolean;
}

const TimeSlotInputs: React.FC<TimeSlotInputsProps> = ({
  slot,
  onRemove,
  onTimeChange,
  getExcludedTimes = () => [],
  canRemove = true,
}) => {
  const parseTimeString = (timeString: string): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div className={styles.container}>
      <div className={styles.timePickerWrapper}>
        <DatePicker
          selected={parseTimeString(slot.startTime)}
          onChange={(time) => onTimeChange("startTime", time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          timeCaption="Heure"
          dateFormat="HH:mm"
          placeholderText="Heure de début *"
          locale="fr"
          className={styles.timePicker}
          excludeTimes={getExcludedTimes(true)}
          onKeyDown={(e) => e.preventDefault()}
          minTime={new Date(new Date().setHours(0, 0, 0))}
          maxTime={
            slot.endTime
              ? parseTimeString(slot.endTime)!
              : new Date(new Date().setHours(23, 59, 0))
          }
          popperProps={{
            strategy: "fixed",
          }}
        />
        <p className={styles.timeSeparator}>à</p>
        <DatePicker
          selected={parseTimeString(slot.endTime)}
          onChange={(time) => onTimeChange("endTime", time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          timeCaption="Heure"
          dateFormat="HH:mm"
          placeholderText="Heure de fin *"
          locale="fr"
          minTime={
            slot.startTime
              ? parseTimeString(slot.startTime)!
              : new Date(new Date().setHours(0, 0, 0))
          }
          maxTime={new Date(new Date().setHours(23, 59, 0))}
          className={styles.timePicker}
          excludeTimes={getExcludedTimes(false)}
          onKeyDown={(e) => e.preventDefault()}
          popperProps={{
            strategy: "fixed",
          }}
        />
      </div>
      {canRemove && (
        <Button
          onClick={onRemove}
          variant="simple"
          size="small"
          ariaLabel="Supprimer ce créneau horaire"
        >
          <XCircle size={20} />
        </Button>
      )}
    </div>
  );
};

export default TimeSlotInputs;
