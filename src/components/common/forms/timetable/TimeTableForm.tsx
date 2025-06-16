import { DefaultSchedule } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import DayInput from "./DayInput";
import { DaySchedule, WeekDay } from "./TimeTable.types";

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
