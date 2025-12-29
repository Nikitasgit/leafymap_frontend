import React from "react";
import { Calendar } from "lucide-react";
import { EventCard } from "@/components/userProfile/EventsSection/EventCard";
import styles from "./EventsSectionContainer.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";
import PlaceEventsSection from "@/components/placeProfile/PlaceEventsSection/PlaceEventsSection";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { EventsSectionContainerProps } from "./EventsSectionContainer.types";

const EventsSectionContainer: React.FC<EventsSectionContainerProps> = ({
  eventPartnerships,
  user,
}) => {
  const placeId =
    user?.place && typeof user.place === "object" ? user.place._id : null;
  const { events, isLoading: eventsLoading } = usePlaceEvents(
    placeId as string
  );

  if (eventsLoading) return <LoadingBar />;
  return (
    <>
      <section className={styles.eventsSection}>
        <h3>{user.username} participe à ces événements</h3>
        <div className={styles.eventsList}>
          {eventPartnerships.length > 0 ? (
            eventPartnerships.map((partnership) => {
              const { event, place } = partnership;
              return (
                <EventCard key={partnership._id} event={event} place={place} />
              );
            })
          ) : (
            <EmptyState
              title="Aucun événement prévu pour le moment"
              icon={<Calendar className={styles.icon} />}
            />
          )}
        </div>
      </section>
      {user.place && typeof user.place === "object" && events.length > 0 && (
        <PlaceEventsSection
          events={events}
          title={`Événements créés par ${user.username}`}
        />
      )}
    </>
  );
};

export default EventsSectionContainer;
