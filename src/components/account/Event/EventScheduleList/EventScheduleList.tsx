"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { EventTimeSlot, Period } from "@/types/place/schedule";
import styles from "./EventScheduleList.module.scss";
import EventScheduleListCard from "../EventScheduleListCard";
import { Partnership } from "@/types/partnerships";
import EmptyState from "@/components/common/noResults/EmptyState";

interface EventScheduleListProps {
  schedule: Period[];
  partnerships: Partnership[];
  onDeletePeriod: (periodId: string) => void;
  onUpdateTimeSlot: (periodId: string, timeSlot: EventTimeSlot) => void;
  onDeleteTimeSlot: (periodId: string, timeSlotId: string) => void;
  onUpdatePeriod: (
    periodId: string,
    startDate: Date,
    endDate: Date | null
  ) => void;

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
  const { t } = useTranslation("events");

  return (
    <>
      {schedule.length === 0 ? (
        <EmptyState
          isError={!!errors.schedule}
          title={errors.schedule || t("eventScheduleList.emptyTitle")}
        />
      ) : (
        <section className={styles.eventScheduleList}>
          {schedule.map((period) => (
            <EventScheduleListCard
              key={period.id}
              period={period}
              onUpdatePeriod={onUpdatePeriod}
              onDeletePeriod={onDeletePeriod}
              partnerships={partnerships}
              onUpdateTimeSlot={onUpdateTimeSlot}
              onDeleteTimeSlot={onDeleteTimeSlot}
            />
          ))}
        </section>
      )}
    </>
  );
};

export default EventScheduleList;
