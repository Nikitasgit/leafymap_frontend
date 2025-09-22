import React from "react";
import { Calendar } from "lucide-react";
import Text from "@/components/common/typography/Text";
import EventCard from "@/components/userProfile/EventsSection/EventCard/EventCard";
import { Event } from "@/types/place/event";
import styles from "./PlaceEventsSection.module.scss";

interface PlaceEventsSectionProps {
  events: Event[];
}

const PlaceEventsSection: React.FC<PlaceEventsSectionProps> = ({ events }) => {
  return (
    <section>
      <Text as="h3">Événements</Text>
      <div className={styles.eventsList}>
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <div className={styles.emptyState}>
            <Calendar className={styles.icon} />
            <Text as="p" className={styles.text}>
              Aucun événement prévu pour le moment
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlaceEventsSection;
