"use client";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./EventsTab.module.scss";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventCard from "@/components/common/events/EventCard";
import EventModal from "@/components/common/modals/EventModal";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface EventsTabProps {
  username: string;
  place?: PlacePopulated;
  user?: UserPopulated;
  events: EventPopulated[];
}

const EventsTab = ({ username, place, user, events }: EventsTabProps) => {
  const { t } = useTranslation("events");
  const [selectedEvent, setSelectedEvent] = useState<EventPopulated | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: EventPopulated) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.eventsContainer}>
        <h3 className={styles.sectionTitle}>
          <Trans
            i18nKey="eventsTab.title"
            ns="events"
            count={events.length}
            values={{ username: capitalizeFirstLetter(username) }}
            components={{ b: <b /> }}
          />
        </h3>
        <div className={styles.eventsList}>
          {events.map((event) => {
            const eventPlace =
              typeof event.place === "object" && event.place
                ? (event.place as PlacePopulated)
                : undefined;
            const eventUser =
              typeof event.user === "object" && event.user
                ? (event.user as UserPopulated)
                : undefined;

            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={styles.eventCardWrapper}
              >
                <EventCard
                  event={event}
                  place={eventPlace ?? place}
                  user={eventUser ?? user}
                  clickable={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          place={
            typeof selectedEvent.place === "object" && selectedEvent.place
              ? (selectedEvent.place as PlacePopulated)
              : place
          }
          user={
            typeof selectedEvent.user === "object" && selectedEvent.user
              ? (selectedEvent.user as UserPopulated)
              : user
          }
        />
      )}
    </>
  );
};

export default EventsTab;
