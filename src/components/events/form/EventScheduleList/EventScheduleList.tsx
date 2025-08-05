import React from "react";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import Text from "@/components/common/typography/Text";
import styles from "./EventScheduleList.module.scss";
import EventScheduleListCard from "../EventScheduleListCard/EventScheduleListCard";
import { Collaborator } from "@/types/place/collaborators";

interface EventScheduleListProps {
  schedule: Period[];
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;
  onDeletePeriod: (periodId: string) => void;
  collaborators: Collaborator[];
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
}

const EventScheduleList: React.FC<EventScheduleListProps> = ({
  schedule,
  onUpdatePeriod,
  onDeletePeriod,
  collaborators,
  onUpdateTimeSlot,
}) => {
  if (schedule.length === 0) {
    return (
      <div className={styles.eventScheduleList}>
        <div className={styles.emptyState}>
          <Text>Aucune date programmée</Text>
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
          collaborators={collaborators}
          onUpdateTimeSlot={onUpdateTimeSlot}
        />
      ))}
    </div>
  );
};

export default EventScheduleList;
