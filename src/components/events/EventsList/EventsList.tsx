import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import EditEventCard from "@/components/events/editEventCard/EditEventCard";
import { Event } from "@/types/place/event";
import styles from "./EventsList.module.scss";

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
  const router = useRouter();

  return (
    <div className={styles.content}>
      <Text as="h2" className={styles.placeName}>
        Les événements de <span>{placeName}</span> :
      </Text>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <Text as="h3" className={styles.emptyTitle}>
            Aucun événement trouvé
          </Text>
          <Text as="p" className={styles.emptyDescription}>
            Commencez par créer votre premier événement pour attirer des
            visiteurs.
          </Text>
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/account/places/${placeId}/events/create`)
            }
          >
            Créer un événement
          </Button>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <EditEventCard key={event._id} event={event} placeId={placeId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
