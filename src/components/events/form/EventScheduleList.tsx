import React from "react";
import { Period } from "./EventForm";
import Text from "@/components/common/typography/Text";

interface EventScheduleListProps {
  schedule: Period[];
}

const EventScheduleList: React.FC<EventScheduleListProps> = ({ schedule }) => {
  if (schedule.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      {schedule.map((period, index) => (
        <div key={index}>
          <Text as="h3">{period.startDate}</Text>
          <Text as="h3">{period.endDate}</Text>
          {period.timeSlots.map((slot, index) => (
            <div key={index}>
              <Text as="h3">{slot.title}</Text>
              <Text as="h3">{slot.startTime}</Text>
              <Text as="h3">{slot.endTime}</Text>
              <Text as="h3">
                {slot.participants
                  .map((participant) => participant.label)
                  .join(", ")}
              </Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EventScheduleList;
