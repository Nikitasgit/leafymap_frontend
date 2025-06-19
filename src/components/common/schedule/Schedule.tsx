import React, { useState } from "react";
import { DefaultSchedule, Event } from "@/types/place/schedule";
import styles from "./Schedule.module.scss";
import { useRouter } from "next/navigation";

interface ScheduleProps {
  schedule: DefaultSchedule;
  className?: string;
}

const Schedule: React.FC<ScheduleProps> = ({ schedule, className }) => {
  const [expandedHoraires, setExpandedHoraires] = useState<Set<string>>(
    new Set()
  );
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const router = useRouter();

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

  const toggleHoraires = (dayKey: string) => {
    const newExpandedHoraires = new Set(expandedHoraires);
    if (newExpandedHoraires.has(dayKey)) {
      newExpandedHoraires.delete(dayKey);
    } else {
      newExpandedHoraires.add(dayKey);
      // Fermer les événements si on ouvre les horaires
      const newExpandedEvents = new Set(expandedEvents);
      newExpandedEvents.delete(dayKey);
      setExpandedEvents(newExpandedEvents);
    }
    setExpandedHoraires(newExpandedHoraires);
  };

  const toggleEvents = (dayKey: string) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(dayKey)) {
      newExpandedEvents.delete(dayKey);
    } else {
      newExpandedEvents.add(dayKey);
      // Fermer les horaires si on ouvre les événements
      const newExpandedHoraires = new Set(expandedHoraires);
      newExpandedHoraires.delete(dayKey);
      setExpandedHoraires(newExpandedHoraires);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const isHorairesExpanded = (dayKey: string) => expandedHoraires.has(dayKey);
  const isEventsExpanded = (dayKey: string) => expandedEvents.has(dayKey);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className={`${styles.schedule} ${className || ""}`}>
      <h4 className={styles.scheduleTitle}>Horaires d&apos;ouverture</h4>
      <div className={styles.scheduleList}>
        {daysOfWeek.map((day, index) => {
          const daySchedule = schedule[day.key as keyof DefaultSchedule];
          const isCurrentDay = index === currentDayIndex;
          const hasTimeSlots = daySchedule.timeSlots.length > 0;
          const hasDayEvents = Boolean(
            daySchedule.events && daySchedule.events.length > 0
          );
          const isHorairesOpen = isHorairesExpanded(day.key);
          const isEventsOpen = isEventsExpanded(day.key);

          return (
            <div key={day.key} className={styles.scheduleDayContainer}>
              <div className={styles.scheduleItem}>
                <div className={styles.dayInfo}>
                  <span className={styles.dayName}>{day.label}</span>
                  {isCurrentDay && (
                    <span className={styles.currentDayBadge}>
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>

                <div className={styles.scheduleStatus}>
                  <div className={styles.buttonGroup}>
                    {hasTimeSlots ? (
                      <button
                        className={`${styles.statusButton} ${
                          daySchedule.open
                            ? styles.openButton
                            : styles.closedButton
                        } ${isHorairesOpen ? styles.active : ""}`}
                        onClick={() => toggleHoraires(day.key)}
                      >
                        <span className={styles.statusText}>
                          {daySchedule.open ? "Ouvert" : "Fermé"}
                        </span>
                        <span
                          className={`${styles.expandIcon} ${
                            isHorairesOpen ? styles.expanded : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                    ) : !hasDayEvents ? (
                      <div
                        className={`${styles.statusDisplay} ${
                          daySchedule.open
                            ? styles.openStatus
                            : styles.closedStatus
                        }`}
                      >
                        <span className={styles.statusText}>
                          {daySchedule.open ? "Ouvert" : "Fermé"}
                        </span>
                      </div>
                    ) : null}

                    {hasDayEvents && (
                      <button
                        className={`${styles.statusButton} ${
                          styles.eventsButton
                        } ${isEventsOpen ? styles.active : ""}`}
                        onClick={() => toggleEvents(day.key)}
                      >
                        <span className={styles.statusText}>Événements</span>
                        <span
                          className={`${styles.expandIcon} ${
                            isEventsOpen ? styles.expanded : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isHorairesOpen && hasTimeSlots && (
                <div className={styles.timeSlotsExpanded}>
                  <div className={styles.timeSlotsSection}>
                    <h5 className={styles.sectionTitle}>Horaires</h5>
                    {daySchedule.timeSlots.map((slot, slotIndex) => (
                      <div key={slotIndex} className={styles.timeSlotExpanded}>
                        <span className={styles.timeSlotTime}>
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEventsOpen && hasDayEvents && daySchedule.events && (
                <div className={styles.timeSlotsExpanded}>
                  <div className={styles.eventsSection}>
                    <h5 className={styles.sectionTitle}>Événements</h5>
                    {daySchedule.events.map(
                      (event: Event, eventIndex: number) => (
                        <div
                          key={eventIndex}
                          className={styles.eventItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event.id);
                          }}
                        >
                          <span className={styles.eventName}>{event.name}</span>
                          <span className={styles.eventArrow}>→</span>
                        </div>
                      )
                    )}
                  </div>
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
