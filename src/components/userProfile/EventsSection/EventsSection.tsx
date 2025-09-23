import React from "react";
import { Calendar } from "lucide-react";
import Text from "@/components/common/typography/Text";
import EventCard from "./EventCard/EventCard";
import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./EventsSection.module.scss";
import EmptyState from "@/components/common/noResults/emptyState";

interface EventsSectionProps {
  eventPartnerships: PartnershipPopulated[];
  user: User;
}

const EventsSection: React.FC<EventsSectionProps> = ({
  eventPartnerships,
  user,
}) => {
  return (
    <section>
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
  );
};

export default EventsSection;
