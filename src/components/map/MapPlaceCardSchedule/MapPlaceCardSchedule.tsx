import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DefaultSchedule, WeekDay } from "@/types/place/schedule";
import { useTranslation } from "react-i18next";
import styles from "./MapPlaceCardSchedule.module.scss";
import { MapPlaceCardScheduleProps } from "./MapPlaceCardSchedule.types";
import Button from "@/components/common/buttons/Button";
import EventSmallCard from "@/components/common/events/EventSmallCard";
import EventModal from "@/components/common/modals/EventModal/EventModal";
import { useEvent } from "@/hooks/useEvent";
import { EventPopulated } from "@/types/place/event";

interface ScheduleDayProps {
  dayKey: WeekDay;
  daySchedule: DefaultSchedule[keyof DefaultSchedule];
  isTimeSlotsExpanded: boolean;
  isEventsExpanded: boolean;
  onToggleTimeSlots: () => void;
  onToggleEvents: () => void;
  onEventClick: (eventId: string) => void;
}

const ScheduleDay: React.FC<ScheduleDayProps> = ({
  dayKey,
  daySchedule,
  isTimeSlotsExpanded,
  isEventsExpanded,
  onToggleTimeSlots,
  onToggleEvents,
  onEventClick,
}) => {
  const { t } = useTranslation("common");
  const isOpen = daySchedule.open;
  const hasTimeSlots = daySchedule.timeSlots?.length > 0;
  const hasEvents = daySchedule.events && daySchedule.events.length > 0;

  const handleEventsClick = () => {
    onToggleEvents();
  };

  const handleEventCardClick = (eventId: string) => {
    onEventClick(eventId);
  };

  return (
    <div className={styles.scheduleDayContainer}>
      <div className={styles.dayHeader}>
        <div className={styles.dayHeaderContent}>
          <span className={styles.dayName}>
            {t(`defaultSchedule.day.${dayKey}`)}
          </span>
          <div className={styles.statusContainer}>
            {hasEvents && (
              <Button
                type="button"
                variant="outline"
                size="xSmall"
                onClick={handleEventsClick}
                ariaLabel="Afficher les événements"
                endIcon={
                  <ChevronRight
                    size={12}
                    className={`${styles.eventsChevron} ${
                      isEventsExpanded ? styles.eventsChevronExpanded : ""
                    }`}
                  />
                }
              >
                Événements
              </Button>
            )}
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
        <div className={styles.chevronContainer}>
          {hasTimeSlots && (
            <button
              type="button"
              className={styles.chevronButton}
              onClick={onToggleTimeSlots}
              aria-expanded={isTimeSlotsExpanded}
              aria-label="Afficher les horaires"
            >
              <ChevronRight
                size={16}
                className={`${styles.chevron} ${
                  isTimeSlotsExpanded ? styles.chevronExpanded : ""
                }`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
      {isTimeSlotsExpanded && hasTimeSlots && (
        <div className={styles.dayContent}>
          <div className={styles.timeSlots}>
            {daySchedule.timeSlots.map((slot, index) => (
              <span key={index} className={styles.timeSlot}>
                {slot.startTime} - {slot.endTime}
              </span>
            ))}
          </div>
        </div>
      )}
      {isEventsExpanded && hasEvents && (
        <div className={styles.eventsContainer}>
          <div className={styles.events}>
            {daySchedule.events?.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventCardClick(event.id)}
                style={{ cursor: "pointer" }}
              >
                <EventSmallCard event={event} enableNavigation={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MapPlaceCardSchedule: React.FC<MapPlaceCardScheduleProps> = ({
  schedule,
  className,
  place,
  user,
  isPlaceLoading = false,
}) => {
  const { t } = useTranslation("common");
  const [expandedTimeSlots, setExpandedTimeSlots] = useState<Set<WeekDay>>(
    new Set()
  );
  const [expandedEvents, setExpandedEvents] = useState<Set<WeekDay>>(new Set());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { event: selectedEvent, isLoading: isLoadingEvent } = useEvent(
    selectedEventId || ""
  );

  const toggleTimeSlots = (dayKey: WeekDay) => {
    setExpandedTimeSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayKey)) {
        newSet.delete(dayKey);
      } else {
        newSet.add(dayKey);
        setExpandedEvents((eventsSet) => {
          const newEventsSet = new Set(eventsSet);
          newEventsSet.delete(dayKey);
          return newEventsSet;
        });
      }
      return newSet;
    });
  };

  const toggleEvents = (dayKey: WeekDay) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayKey)) {
        newSet.delete(dayKey);
      } else {
        newSet.add(dayKey);
      }
      return newSet;
    });
  };

  const handleEventClick = (eventId: string) => {
    if (selectedEventId === eventId && selectedEvent) {
      setIsModalOpen(true);
      return;
    }
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`${styles.schedule} ${className || ""}`}>
        <h4 className={styles.scheduleTitle}>{t("defaultSchedule.title")}</h4>
        <div className={styles.scheduleList}>
          {Object.keys(schedule).map((dayKey) => (
            <ScheduleDay
              key={dayKey}
              dayKey={dayKey as WeekDay}
              daySchedule={schedule[dayKey as keyof DefaultSchedule]}
              isTimeSlotsExpanded={expandedTimeSlots.has(dayKey as WeekDay)}
              isEventsExpanded={expandedEvents.has(dayKey as WeekDay)}
              onToggleTimeSlots={() => toggleTimeSlots(dayKey as WeekDay)}
              onToggleEvents={() => toggleEvents(dayKey as WeekDay)}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
      </div>

      {isModalOpen && selectedEvent && !isLoadingEvent && (
        <EventModal
          key={selectedEventId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent as EventPopulated}
          place={place || undefined}
          user={user || undefined}
          isContentLoading={isPlaceLoading}
        />
      )}
    </>
  );
};

export default MapPlaceCardSchedule;
