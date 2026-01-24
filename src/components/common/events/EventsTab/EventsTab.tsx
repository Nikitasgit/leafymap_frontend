"use client";
import { useState } from "react";
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
          <b>{capitalizeFirstLetter(username)}</b> organise ces événements (
          {events.length}):
        </h3>
        <div className={styles.eventsList}>
          {events.map((event) => {
            return (
              <div
                key={event._id}
                onClick={() => handleEventClick(event)}
                className={styles.eventCardWrapper}
              >
                <EventCard
                  event={event}
                  place={place}
                  user={user}
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
          place={place}
          user={user}
        />
      )}
    </>
  );
};

export default EventsTab;
