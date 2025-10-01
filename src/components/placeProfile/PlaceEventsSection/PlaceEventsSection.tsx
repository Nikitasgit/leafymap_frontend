import { Calendar } from "lucide-react";
import EventCard from "@/components/userProfile/EventsSection/EventCard/EventCard";
import styles from "./PlaceEventsSection.module.scss";
import { PlaceEventsSectionProps } from "./PlaceEventsSection.types";
import EmptyState from "@/components/common/noResults/EmptyStatetempname";

const PlaceEventsSection: React.FC<PlaceEventsSectionProps> = ({
  events,
  title = "Événements",
}) => {
  return (
    <section className={styles.placeEventsSection}>
      <h3>{title}</h3>
      <div className={styles.eventsList}>
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
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

export default PlaceEventsSection;
