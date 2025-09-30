import React from "react";
import { DefaultSchedule } from "@/types/place/schedule";
import { useTranslation } from "react-i18next";
import styles from "./MapPlaceCardSchedule.module.scss";
import { MapPlaceCardScheduleProps } from "./MapPlaceCardSchedule.types";

const MapPlaceCardSchedule: React.FC<MapPlaceCardScheduleProps> = ({
  schedule,
  className,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className={`${styles.schedule} ${className || ""}`}>
      <h4 className={styles.scheduleTitle}>{t("defaultSchedule.title")}</h4>
      <div className={styles.scheduleList}>
        {Object.keys(schedule).map((dayKey) => {
          const daySchedule = schedule[dayKey as keyof DefaultSchedule];
          const isOpen = daySchedule.open;
          const hasTimeSlots = daySchedule.timeSlots?.length > 0;

          return (
            <div key={dayKey} className={styles.scheduleDayContainer}>
              <div className={styles.scheduleItem}>
                <div className={styles.dayInfo}>
                  <span className={styles.dayName}>
                    {t(`defaultSchedule.day.${dayKey}`)}
                  </span>
                  {hasTimeSlots && (
                    <div className={styles.timeSlots}>
                      {daySchedule.timeSlots.map((slot, index) => (
                        <span key={index} className={styles.timeSlot}>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.scheduleStatus}>
                  <div
                    className={`${styles.statusDisplay} ${
                      isOpen ? styles.openStatus : styles.closedStatus
                    }`}
                  >
                    <span className={styles.statusText}>
                      {t(`defaultSchedule.${isOpen ? "open" : "closed"}`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapPlaceCardSchedule;
