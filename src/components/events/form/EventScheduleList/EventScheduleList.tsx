import React from "react";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import Text from "@/components/common/typography/Text";
import styles from "./EventScheduleList.module.scss";
import EventScheduleListCard from "../EventScheduleListCard/EventScheduleListCard";
import { Partnership } from "@/types/partnerships";

interface EventScheduleListProps {
  schedule: Period[];
  partnerships: Partnership[];
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;
  onDeletePeriod: (periodId: string) => void;
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
  onDeleteTimeSlot: (periodId: string, timeSlotId: string) => void;
  errors?: Record<string, string>;
}

const EventScheduleList: React.FC<EventScheduleListProps> = ({
  schedule,
  partnerships,
  onUpdatePeriod,
  onDeletePeriod,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
  errors = {},
}) => {
  if (schedule.length === 0) {
    return (
      <div className={styles.eventScheduleList}>
        <div
          className={`${styles.emptyState} ${
            errors.schedule ? styles.error : ""
          }`}
        >
          <Text>{errors.schedule || "Aucune date programmée"}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventScheduleList}>
      {schedule.map((period) => (
        <EventScheduleListCard
          key={period._id}
          period={period}
          onUpdatePeriod={onUpdatePeriod}
          onDeletePeriod={onDeletePeriod}
          partnerships={partnerships}
          onUpdateTimeSlot={onUpdateTimeSlot}
          onDeleteTimeSlot={onDeleteTimeSlot}
        />
      ))}
    </div>
  );
};

export default EventScheduleList;
