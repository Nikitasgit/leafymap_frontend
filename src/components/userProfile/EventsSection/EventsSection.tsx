import React from "react";
import { Calendar } from "lucide-react";
import Text from "@/components/common/typography/Text";
import EventCard from "./EventCard/EventCard";
import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./EventsSection.module.scss";
import EmptyState from "@/components/common/noResults/emptyState";
import PlaceEventsSection from "@/components/placeProfile/PlaceEventsSection/PlaceEventsSection";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import LoadingBar from "@/components/common/loading/LoadingBar";

interface EventsSectionProps {
  eventPartnerships: PartnershipPopulated[];
  user: User;
}

const EventsSection: React.FC<EventsSectionProps> = ({
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
        <Text as="h3">{user.creatorName} participe à ces événements</Text>
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
      {user.places && user.places.length > 0 && (
        <PlaceEventsSection
          events={events || []}
          title={`Événements créés par ${user.creatorName}`}
        />
      )}
    </>
  );
};

export default EventsSection;
