import DayInput from "./dayInput/DayInput";
import Text from "../../../common/typography/Text";
import styles from "./TimeTableForm.module.scss";
import { DaySchedule, DefaultSchedule, WeekDay } from "@/types/place/schedule";

interface TimeTableFormProps {
  schedule: DefaultSchedule;
  onChange: (updatedSchedule: DefaultSchedule) => void;
}

const TimeTableForm = ({ schedule, onChange }: TimeTableFormProps) => {
  const handleDayChange = (day: WeekDay, updated: DaySchedule) => {
    onChange({ ...schedule, [day]: updated });
  };
  const days: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className={styles.timeTableForm}>
      <Text as="h3" className={styles.title}>
        Horaires
      </Text>

      {days.map((day) => (
        <DayInput
          key={day}
          day={day}
          schedule={schedule[day]}
          onChange={(updated) => handleDayChange(day, updated)}
        />
      ))}
    </div>
  );
};

export default TimeTableForm;
