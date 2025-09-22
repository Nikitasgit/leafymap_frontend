"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Period } from "@/types/place/schedule";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Users } from "lucide-react";
import Text from "@/components/common/typography/Text";
import styles from "./EventSchedule.module.scss";

interface EventScheduleProps {
  schedule: Period[];
}

const EventSchedule: React.FC<EventScheduleProps> = ({ schedule }) => {
  const router = useRouter();

  const handleCollaboratorClick = (collaboratorId: string) => {
    if (collaboratorId) {
      router.push(`/users/${collaboratorId}`);
    }
  };

  if (!schedule || schedule.length === 0) {
    return (
      <div className={styles.scheduleContainer}>
        <Text as="h3" className={styles.scheduleTitle}>
          Programme
        </Text>
        <div className={styles.noSchedule}>
          <Text as="p">Aucun programme disponible pour cet événement.</Text>
        </div>
      </div>
    );
  }

  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    return timeString.slice(0, 5); // Format HH:MM
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    return format(new Date(dateString), "EEEE dd MMMM yyyy", {
      locale: fr,
    });
  };

  const formatDateShort = (dateString: string): string => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd/MM", {
      locale: fr,
    });
  };

  return (
    <div className={styles.scheduleContainer}>
      <Text as="h3" className={styles.scheduleTitle}>
        Programme
      </Text>

      <div className={styles.scheduleList}>
        {schedule.map((period, periodIndex) => (
          <div key={period._id || periodIndex} className={styles.period}>
            <div className={styles.periodHeader}>
              <Calendar size={18} className={styles.periodIcon} />
              <div className={styles.periodDates}>
                <Text as="h4" className={styles.periodDate}>
                  {formatDate(period.startDate)}
                </Text>
                {period.endDate && period.endDate !== period.startDate && (
                  <Text as="p" className={styles.periodDateRange}>
                    {formatDateShort(period.startDate)} -{" "}
                    {formatDateShort(period.endDate)}
                  </Text>
                )}
              </div>
            </div>

            {period.timeSlots && period.timeSlots.length > 0 && (
              <div className={styles.timeSlotsList}>
                {period.timeSlots.map((timeSlot, slotIndex) => (
                  <div
                    key={timeSlot._id || slotIndex}
                    className={styles.timeSlot}
                  >
                    <div className={styles.timeSlotHeader}>
                      <div className={styles.timeSlotTime}>
                        <Clock size={16} className={styles.timeIcon} />
                        <span className={styles.timeRange}>
                          {formatTime(timeSlot.startTime)} -{" "}
                          {formatTime(timeSlot.endTime)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.timeSlotContent}>
                      <Text as="h5" className={styles.timeSlotTitle}>
                        {timeSlot.title}
                      </Text>

                      {timeSlot.collaborators &&
                        timeSlot.collaborators.length > 0 && (
                          <div className={styles.collaborators}>
                            <Users
                              size={14}
                              className={styles.collaboratorsIcon}
                            />
                            <div className={styles.collaboratorsList}>
                              {timeSlot.collaborators.map(
                                (collaborator, collabIndex) => (
                                  <div
                                    key={collaborator._id || collabIndex}
                                    className={styles.collaborator}
                                    onClick={() =>
                                      handleCollaboratorClick(collaborator._id)
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleCollaboratorClick(
                                          collaborator._id
                                        );
                                      }
                                    }}
                                  >
                                    <div className={styles.collaboratorAvatar}>
                                      {collaborator.image &&
                                      typeof collaborator.image === "string" ? (
                                        <Image
                                          src={collaborator.image}
                                          alt={
                                            collaborator.name || "Collaborateur"
                                          }
                                          width={24}
                                          height={24}
                                          className={styles.collaboratorImage}
                                        />
                                      ) : (
                                        <div
                                          className={
                                            styles.collaboratorInitials
                                          }
                                        >
                                          {(collaborator.name || "C")
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)}
                                        </div>
                                      )}
                                    </div>
                                    <span className={styles.collaboratorName}>
                                      {collaborator.name || "Collaborateur"}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
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
