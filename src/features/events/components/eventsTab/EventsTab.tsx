"use client";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./EventsTab.module.scss";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import EventCard from "../eventCard";
import EventModal from "../eventModal";
import { EventPopulated } from "../../types/event";
import { PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

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
              (resolveRefObject(event.place) as PlacePopulated | null) ??
              undefined;
            const eventUser =
              (resolveRefObject(event.user) as UserPopulated | null) ??
              undefined;

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
            (resolveRefObject(selectedEvent.place) as PlacePopulated | null) ??
            place
          }
          user={
            (resolveRefObject(selectedEvent.user) as UserPopulated | null) ??
            user
          }
        />
      )}
    </>
  );
};

export default EventsTab;
