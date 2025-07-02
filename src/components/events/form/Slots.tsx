import { TimeSlot } from "@/components/common/timetable/timeSlotInputs/TimeSlotInputs";
import React from "react";

const Slots = ({ slots }: { slots: TimeSlot[] }) => {
  return (
    <div>
      {slots.map((slot) => (
        <div key={slot._id}>
          <h3>{slot.title}</h3>
          <h3>{slot.startTime}</h3>
          <h3>{slot.endTime}</h3>
          <h3>
            {slot.participants
              .map((participant) => participant.label)
              .join(", ")}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default Slots;
