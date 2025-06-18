import React, { useState } from "react";
import { DefaultSchedule } from "@/types/place/schedule";
import styles from "./Schedule.module.scss";

interface ScheduleProps {
  schedule: DefaultSchedule;
  className?: string;
}

const Schedule: React.FC<ScheduleProps> = ({ schedule, className }) => {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const daysOfWeek = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
  ];

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    // Convert Sunday (0) to 7, and shift other days accordingly
    return today === 0 ? 6 : today - 1;
  };

  const currentDayIndex = getCurrentDay();

  const toggleDay = (dayKey: string, isOpen: boolean) => {
    if (!isOpen) return;
    const newExpandedDays = new Set(expandedDays);
    if (newExpandedDays.has(dayKey)) {
      newExpandedDays.delete(dayKey);
    } else {
      newExpandedDays.add(dayKey);
    }
    setExpandedDays(newExpandedDays);
  };

  const isDayExpanded = (dayKey: string) => expandedDays.has(dayKey);

  return (
    <div className={`${styles.schedule} ${className || ""}`}>
      <h4 className={styles.scheduleTitle}>Horaires d&apos;ouverture</h4>
      <div className={styles.scheduleList}>
        {daysOfWeek.map((day, index) => {
          const daySchedule = schedule[day.key as keyof DefaultSchedule];
          const isCurrentDay = index === currentDayIndex;
          const isExpanded = isDayExpanded(day.key);

          return (
            <div key={day.key} className={styles.scheduleDayContainer}>
              <div
                className={`${styles.scheduleItem} ${
                  isCurrentDay ? styles.currentDay : ""
                } ${isExpanded ? styles.expanded : ""} ${
                  !daySchedule.open ? styles.closed : ""
                }`}
                onClick={() => toggleDay(day.key, daySchedule.open)}
                role={daySchedule.open ? "button" : undefined}
                tabIndex={daySchedule.open ? 0 : -1}
                onKeyDown={(e) => {
                  if (!daySchedule.open) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDay(day.key, daySchedule.open);
                  }
                }}
              >
                <div className={styles.dayInfo}>
                  <span className={styles.dayName}>{day.label}</span>
                  {isCurrentDay && (
                    <span className={styles.currentDayBadge}>
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>

                <div className={styles.scheduleStatus}>
                  {daySchedule.open ? (
                    <div className={styles.openStatus}>
                      <span className={styles.statusText}>Ouvert</span>
                      {daySchedule.timeSlots.length > 0 && (
                        <div className={styles.expandIndicator}>
                          <span
                            className={`${styles.expandIcon} ${
                              isExpanded ? styles.expanded : ""
                            } ${styles.green}`}
                          >
                            ▼
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.closedStatus}>
                      <span className={styles.statusText}>Fermé</span>
                    </div>
                  )}
                </div>
              </div>

              {isExpanded &&
                daySchedule.open &&
                daySchedule.timeSlots.length > 0 && (
                  <div className={styles.timeSlotsExpanded}>
                    {daySchedule.timeSlots.map((slot, slotIndex) => (
                      <div key={slotIndex} className={styles.timeSlotExpanded}>
                        <span className={styles.timeSlotTime}>
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
