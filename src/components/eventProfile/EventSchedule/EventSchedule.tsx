"use client";
import { Clock } from "lucide-react";
import styles from "./EventSchedule.module.scss";
import { formatDateShort, sortPeriodsByStartDate } from "@/utils/dates";

import { EventScheduleProps } from "./EventSchedule.types";
import ParticipantMiniCard from "./ParticipantMiniCard";
import { Collaborator } from "@/types/place/collaborators";

const EventSchedule: React.FC<EventScheduleProps> = ({ schedule, users }) => {
  const sortedSchedule = sortPeriodsByStartDate(schedule);

  const getCollaborator = (
    collaborator: Collaborator | string
  ): EventScheduleProps["users"][0] | undefined => {
    const collaboratorId =
      typeof collaborator === "string" ? collaborator : collaborator._id;
    return users.find((user) => user._id === collaboratorId);
  };

  return (
    <section className={styles.scheduleContainer}>
      <h3 className={styles.sectionTitle}>Programme</h3>
      <div className={styles.scheduleList}>
        {sortedSchedule.map((period) => (
          <div key={period._id} className={styles.period}>
            <div className={styles.periodDates}>
              <div className={styles.dateItem}>
                <p className={styles.dateLabel}>
                  {period.endDate !== period.startDate && period.endDate
                    ? "Du"
                    : "Le"}
                </p>
                <p className={styles.dateValue}>
                  {formatDateShort(period.startDate)}
                </p>
              </div>
              {period.endDate !== period.startDate && period.endDate !== "" && (
                <div className={styles.dateItem}>
                  <p className={styles.dateLabel}>Au</p>
                  <p className={styles.dateValue}>
                    {formatDateShort(period.endDate)}
                  </p>
                </div>
              )}
            </div>
            {period.timeSlots && period.timeSlots.length > 0 && (
              <div className={styles.timeSlotsList}>
                {period.timeSlots.map((timeSlot) => (
                  <div key={timeSlot._id} className={styles.timeSlot}>
                    <div className={styles.timeSlotHeader}>
                      <div className={styles.timeSlotTime}>
                        <Clock size={14} />
                        <p className={styles.timeRange}>
                          {timeSlot.startTime} à {timeSlot.endTime}
                        </p>
                      </div>

                      <p className={styles.timeSlotTitle}>- {timeSlot.title}</p>
                    </div>
                    <div className={styles.participantsList}>
                      {timeSlot.collaborators
                        .map((collaborator) => getCollaborator(collaborator))
                        .filter(
                          (user): user is EventScheduleProps["users"][0] =>
                            user !== undefined
                        )
                        .map((user) => (
                          <ParticipantMiniCard
                            key={user._id}
                            collaborator={user}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventSchedule;
