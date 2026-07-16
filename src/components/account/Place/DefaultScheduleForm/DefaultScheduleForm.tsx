import DayInput from "../DefaultScheduleDay";
import styles from "./DefaultScheduleForm.module.scss";
import { DaySchedule, WeekDay } from "@/types/place/schedule";
import { DefaultScheduleFormProps } from "./DefaultScheduleForm.types";
import { useTranslation } from "react-i18next";

const days: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DefaultScheduleForm = ({
  schedule,
  onChange,
}: DefaultScheduleFormProps) => {
  const { t } = useTranslation("common");

  const handleDayChange = (day: WeekDay, updated: DaySchedule) => {
    onChange({ ...schedule, [day]: updated });
  };
  return (
    <fieldset className={styles.defaultScheduleForm}>
      <legend className={styles.title}>{t("defaultSchedule.title")}</legend>
      {days.map((day) => (
        <DayInput
          key={day}
          day={day}
          schedule={schedule[day]}
          onChange={(updated) => handleDayChange(day, updated)}
        />
      ))}
    </fieldset>
  );
};

export default DefaultScheduleForm;
