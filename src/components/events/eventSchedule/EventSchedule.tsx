"use client";
import React from "react";
import Image from "next/image";
import { Period } from "@/types/place/schedule";
import { Clock } from "lucide-react";
import Text from "@/components/common/typography/Text";
import styles from "./EventSchedule.module.scss";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import { formatDateShort, sortPeriodsByStartDate } from "@/utils/dates";
import { PartnershipPopulated } from "@/types/partnerships";
import { Collaborator } from "@/types/place/collaborators";

interface EventScheduleProps {
  schedule: Period[];
  partnerships: PartnershipPopulated[];
}

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
    <div className={styles.scheduleContainer}>
      <TitleWithLine as="h3" className={styles.scheduleTitle}>
        Programme
      </TitleWithLine>
      <div className={styles.scheduleList}>
        {sortedSchedule.map((period) => (
          <div key={period._id} className={styles.period}>
            <div className={styles.periodDates}>
              <div className={styles.dateItem}>
                <Text className={styles.dateLabel}>
                  {period.endDate !== period.startDate && period.endDate
                    ? "Du"
                    : "Le"}
                </Text>
                <Text className={styles.dateValue}>
                  {formatDateShort(period.startDate)}
                </Text>
              </div>
              {period.endDate !== period.startDate && period.endDate !== "" && (
                <div className={styles.dateItem}>
                  <Text className={styles.dateLabel}>Au</Text>
                  <Text className={styles.dateValue}>
                    {formatDateShort(period.endDate)}
                  </Text>
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
                        <Text as="p" className={styles.timeRange}>
                          {timeSlot.startTime} à {timeSlot.endTime}
                        </Text>
                      </div>

                      <Text as="p" className={styles.timeSlotTitle}>
                        - {timeSlot.title}
                      </Text>
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

                                <Text as="p" className={styles.participantName}>
                                  {collaborator.name}
                                </Text>
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
    </div>
  );
};

export default EventSchedule;
