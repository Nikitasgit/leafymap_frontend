import React from "react";
import { Calendar } from "lucide-react";
import { EventCard } from "@/components/userProfile/EventsSection/EventCard";
import styles from "./EventsSectionContainer.module.scss";
import EmptyState from "@/components/common/noResults/EmptyStatetempname";
import PlaceEventsSection from "@/components/placeProfile/PlaceEventsSection/PlaceEventsSection";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { EventsSectionContainerProps } from "./EventsSectionContainer.types";

const EventsSectionContainer: React.FC<EventsSectionContainerProps> = ({
  eventPartnerships,
  user,
}) => {
  const { events, isLoading: eventsLoading } = usePlaceEvents(
    user?.places?.[0]._id as string
  );

  if (eventsLoading) return <LoadingBar />;
  return (
    <>
      <section className={styles.eventsSection}>
        <h3>{user.creatorName} participe à ces événements</h3>
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
      {user.places && user.places.length > 0 && events.length > 0 && (
        <PlaceEventsSection
          events={events}
          title={`Événements créés par ${user.creatorName}`}
        />
      )}
    </>
  );
};

export default EventsSectionContainer;
