"use client";
import Image from "next/image";
import { Clock } from "lucide-react";
import styles from "./EventProfileSchedule.module.scss";
import TitleWithLine from "@/components/common/typography/TitleWithLinetempname";
import { formatDateShort, sortPeriodsByStartDate } from "@/utils/dates";
import { Collaborator } from "@/types/place/collaborators";
import { EventScheduleProps } from "./EventProfileSchedule.types";

const EventSchedule: React.FC<EventScheduleProps> = ({
  schedule,
  partnerships,
}) => {
  const sortedSchedule = sortPeriodsByStartDate(schedule);

  const isCollaboratorInPartnerships = (collaboratorId: string): boolean => {
    return partnerships.some(
      (partnership) =>
        partnership.collaborator._id === collaboratorId &&
        partnership.status === "accepted"
    );
  };

  const getFilteredCollaborators = (collaborators: Collaborator[]) => {
    return collaborators.filter((collaborator) =>
      isCollaboratorInPartnerships(collaborator._id)
    );
  };

  return (
    <section className={styles.scheduleContainer}>
      <TitleWithLine className={styles.scheduleTitle}>Programme</TitleWithLine>
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
                    {(() => {
                      const filteredCollaborators = getFilteredCollaborators(
                        timeSlot.collaborators || []
                      );
                      return (
                        filteredCollaborators.length > 0 && (
                          <div className={styles.participantsList}>
                            {filteredCollaborators.map((collaborator) => (
                              <div
                                key={collaborator._id}
                                className={styles.participant}
                              >
                                <Image
                                  src={
                                    (collaborator.image as string) ||
                                    "https://i.pravatar.cc/40?img=3"
                                  }
                                  alt={collaborator.name || "Participant"}
                                  className={styles.participantImage}
                                  width={24}
                                  height={24}
                                />

                                <p className={styles.participantName}>
                                  {collaborator.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )
                      );
                    })()}
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
