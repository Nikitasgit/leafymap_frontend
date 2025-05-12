import {
  DaySchedule,
  TimeSlot,
  WeekDay,
} from "@/components/account/createProfileStepper/CreateProfileStepper";

interface DayInputProps {
  day: WeekDay;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}

const DayInput = ({ day, schedule, onChange }: DayInputProps) => {
  const handleToggleOpen = () => {
    onChange({ ...schedule, open: !schedule.open });
  };

  const handleSlotChange = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const slot = schedule.timeSlots[index];
    const updatedSlot = { ...slot, [field]: value };

    if (
      updatedSlot.startTime &&
      updatedSlot.endTime &&
      updatedSlot.endTime < updatedSlot.startTime
    ) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    const updatedSlots = schedule.timeSlots.map((s, i) =>
      i === index ? updatedSlot : s
    );
    onChange({ ...schedule, timeSlots: updatedSlots });
  };

  const addTimeSlot = () => {
    onChange({
      ...schedule,
      timeSlots: [...schedule.timeSlots, { startTime: "", endTime: "" }],
    });
  };

  const removeTimeSlot = (index: number) => {
    const updatedSlots = schedule.timeSlots.filter((_, i) => i !== index);
    onChange({ ...schedule, timeSlots: updatedSlots });
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
        <div>
          {schedule.timeSlots.map((slot, index) => (
            <div key={index}>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  handleSlotChange(index, "startTime", e.target.value)
                }
              />
              <span>to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  handleSlotChange(index, "endTime", e.target.value)
                }
              />
              <button type="button" onClick={() => removeTimeSlot(index)}>
                ❌
              </button>
            </div>
          ))}
          <button type="button" onClick={addTimeSlot}>
            ➕ Add time slot
          </button>
        </div>
      )}
    </div>
  );
};

export default DayInput;
