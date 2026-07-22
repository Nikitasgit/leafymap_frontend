"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import styles from "./EventSchedule.module.scss";
import { formatDateShort, sortPeriodsByStartDate } from "@/shared/utils/dates";
import { EventScheduleProps } from "./EventSchedule.types";
import { Collaborator } from "@/features/places/types/collaborators";
import creatorDefaultsSvg from "@public/images/creator_default.png";
import { resolveRefId } from "@/shared/api/normalizers/resolveRef";

const EventSchedule: React.FC<EventScheduleProps> = ({ schedule, users }) => {
  const { t } = useTranslation("events");
  const sortedSchedule = sortPeriodsByStartDate(schedule);

  const getCollaborator = (
    collaborator: Collaborator | string,
  ): EventScheduleProps["users"][0] | undefined => {
    const collaboratorId = resolveRefId(collaborator);
    return users.find((user) => user.id === collaboratorId);
  };

  return (
    <section className={styles.scheduleContainer}>
      <h3 className={styles.sectionTitle}>{t("eventSchedule.title")}</h3>
      <div className={styles.scheduleList}>
        {sortedSchedule.map((period) => (
          <div key={period.id} className={styles.period}>
            <div className={styles.periodDates}>
              <div className={styles.dateItem}>
                <p className={styles.dateLabel}>
                  {period.endDate !== period.startDate && period.endDate
                    ? t("eventSchedule.dateFrom")
                    : t("eventSchedule.dateOn")}
                </p>
                <p className={styles.dateValue}>
                  {formatDateShort(period.startDate)}
                </p>
              </div>
              {period.endDate !== period.startDate && period.endDate !== "" && (
                <div className={styles.dateItem}>
                  <p className={styles.dateLabel}>{t("eventSchedule.dateTo")}</p>
                  <p className={styles.dateValue}>
                    {formatDateShort(period.endDate)}
                  </p>
                </div>
              )}
            </div>
            {period.timeSlots && period.timeSlots.length > 0 && (
              <div className={styles.timeSlotsList}>
                {period.timeSlots.map((timeSlot) => (
                  <div key={timeSlot.id} className={styles.timeSlot}>
                    <div className={styles.timeSlotHeader}>
                      <div className={styles.timeSlotTime}>
                        <Clock size={14} />
                        <p className={styles.timeRange}>
                          {t("eventSchedule.timeRange", {
                            startTime: timeSlot.startTime,
                            endTime: timeSlot.endTime,
                          })}
                        </p>
                      </div>
                      <p className={styles.timeSlotTitle}>- {timeSlot.title}</p>
                    </div>
                    <div className={styles.participantsList}>
                      {timeSlot.collaborators
                        .map((collaborator) => getCollaborator(collaborator))
                        .filter(
                          (user): user is EventScheduleProps["users"][0] =>
                            user !== undefined,
                        )
                        .map((user) => {
                          const imageUrl = user.image?.urls?.thumbnail ?? "";
                          const displayName =
                            user.username ?? t("eventSchedule.defaultParticipant");
                          return (
                            <div
                              key={user.id}
                              className={styles.participantCard}
                              title={displayName}
                            >
                              <Image
                                src={imageUrl || creatorDefaultsSvg}
                                alt={displayName}
                                width={24}
                                height={24}
                                className={styles.participantImage}
                              />
                              <span className={styles.participantName}>
                                {displayName}
                              </span>
                            </div>
                          );
                        })}
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
