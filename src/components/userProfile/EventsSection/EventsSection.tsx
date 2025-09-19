import React from "react";
import { Calendar } from "lucide-react";
import Text from "@/components/common/typography/Text";
import { Partnership } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./EventsSection.module.scss";

interface EventsSectionProps {
  eventPartnerships: Partnership[];
  user: User;
}

const EventsSection: React.FC<EventsSectionProps> = ({
  eventPartnerships,
  user,
}) => {
  return (
    <section className={styles.eventsSection}>
      <Text as="h2">
        <Calendar
          size={20}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
        />
        Événements avec {user.creatorName}
      </Text>
      <div className={styles.eventsList}>
        {eventPartnerships.length > 0 ? (
          eventPartnerships.map((partnership) => {
            const event = partnership.event;
            return (
              <div key={partnership._id} className={styles.eventItem}>
                <Calendar size={16} className={styles.eventIcon} />
                <Text as="p">{event?.name}</Text>
              </div>
            );
          })
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

export default EventsSection;
