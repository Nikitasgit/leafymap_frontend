import React from "react";
import { Calendar } from "lucide-react";
import Text from "@/components/common/typography/Text";
import { Event } from "@/types/place/event";
import styles from "./PlaceEventsSection.module.scss";

interface PlaceEventsSectionProps {
  events: Event[];
  placeName: string;
}

const PlaceEventsSection: React.FC<PlaceEventsSectionProps> = ({
  events,
  placeName,
}) => {
  return (
    <section>
      <Text as="h3">Événements à {placeName}</Text>
      <div className={styles.eventsList}>
        {events.length > 0 ? (
          <div className={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event._id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <Text as="h4" className={styles.eventTitle}>
                    {event.name}
                  </Text>
                  <div className={styles.eventDate}>
                    <Calendar size={14} />
                    <Text as="p" className={styles.dateText}>
                      {new Date(
                        event.schedule[0]?.startDate || ""
                      ).toLocaleDateString("fr-FR")}
                    </Text>
                  </div>
                </div>
                {event.description && (
                  <Text as="p" className={styles.eventDescription}>
                    {event.description.length > 150
                      ? `${event.description.substring(0, 150)}...`
                      : event.description}
                  </Text>
                )}
              </div>
            ))}
          </div>
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
