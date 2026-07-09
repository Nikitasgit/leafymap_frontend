"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { enUS } from "date-fns/locale/en-US";
import { useTranslation } from "react-i18next";
import { EventTimeSlot, TimeSlot } from "@/types/place/schedule";
import styles from "./TimeSlotInputs.module.scss";
import { XCircle } from "lucide-react";
import Button from "../../buttons/Button";

registerLocale("fr", fr);
registerLocale("en", enUS);

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
  const { t, i18n } = useTranslation("common");
  const dateLocale = i18n.language === "fr" ? "fr" : "en";

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
          onChange={(time: Date | null) => onTimeChange("startTime", time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          timeCaption={t("datesSelector.timeCaption")}
          dateFormat="HH:mm"
          placeholderText={t("timeSlotInputs.startTimePlaceholder")}
          locale={dateLocale}
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
        <p className={styles.timeSeparator}>{t("timeSlotInputs.separator")}</p>
        <DatePicker
          selected={parseTimeString(slot.endTime)}
          onChange={(time: Date | null) => onTimeChange("endTime", time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={10}
          timeCaption={t("datesSelector.timeCaption")}
          dateFormat="HH:mm"
          placeholderText={t("timeSlotInputs.endTimePlaceholder")}
          locale={dateLocale}
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
          ariaLabel={t("timeSlotInputs.removeSlotAriaLabel")}
        >
          <XCircle size={20} />
        </Button>
      )}
    </div>
  );
};

export default TimeSlotInputs;
