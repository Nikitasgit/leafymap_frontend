import React from "react";
import AccountEventCard from "@/components/account/AccountEventCard";
import { Event } from "@/types/place/event";
import styles from "./AccountEventsList.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";

interface EventsListProps {
  events: Event[];
  placeId: string;
  placeName: string;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  placeId,
  placeName,
}) => {
  return (
    <section className={styles.content}>
      <h2 className={styles.placeName}>
        Les événements de <span>{placeName}</span> :
      </h2>
      {events.length === 0 ? (
        <EmptyState
          title="Aucun événement"
          description="Commencez par créer votre premier événement pour attirer des visiteurs."
        />
      ) : (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <AccountEventCard key={event._id} event={event} placeId={placeId} />
          ))}
        </div>
      )}
    </section>
  );
};

export default EventsList;
