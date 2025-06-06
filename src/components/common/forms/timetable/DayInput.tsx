import { DaySchedule, WeekDay } from "./TimeTable.types";
import TimeSlotsInput, { TimeSlot } from "./TimeSlotsInput";

interface DayInputProps {
  day: WeekDay;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}

const DayInput = ({ day, schedule, onChange }: DayInputProps) => {
  const handleToggleOpen = () => {
    onChange({ ...schedule, open: !schedule.open });
  };

  const handleTimeSlotsChange = (timeSlots: TimeSlot[]) => {
    onChange({ ...schedule, timeSlots });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={schedule.open}
          onChange={handleToggleOpen}
        />
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </label>

      {schedule.open && (
        <div style={{ marginLeft: "20px", marginTop: "8px" }}>
          <TimeSlotsInput
            timeSlots={schedule.timeSlots}
            onChange={handleTimeSlotsChange}
          />
        </div>
      )}
    </div>
  );
};

export default DayInput;
