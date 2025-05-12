import {
  DaySchedule,
  DefaultSchedule,
  WeekDay,
} from "@/components/account/createProfileStepper/CreateProfileStepper";
import DayInput from "./DayInput";

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
    <div>
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
