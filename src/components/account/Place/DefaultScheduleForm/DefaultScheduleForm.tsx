import DayInput from "../DefaultScheduleDay";
import styles from "./DefaultScheduleForm.module.scss";
import { DaySchedule, WeekDay } from "@/types/place/schedule";
import { DefaultScheduleFormProps } from "./DefaultScheduleForm.types";

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
  const handleDayChange = (day: WeekDay, updated: DaySchedule) => {
    onChange({ ...schedule, [day]: updated });
  };
  return (
    <fieldset className={styles.defaultScheduleForm}>
      <legend className={styles.title}>Horaires</legend>
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
