import styles from "./EventsTab.module.scss";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventCard from "@/components/common/events/EventCard";

export interface EventsTabProps {
  placeId: string;
  username: string;
}

const EventsTab = ({ placeId, username }: EventsTabProps) => {
  const { events, isLoading } = usePlaceEvents(placeId);

  if (isLoading || events.length === 0) {
    return null;
  }

  return (
    <div className={styles.eventsContainer}>
      <h3 className={styles.sectionTitle}>
        <b>{capitalizeFirstLetter(username)}</b> organise ces événements (
        {events.length}):
      </h3>
      <div className={styles.eventsList}>
        {events.map((event) => {
          return <EventCard key={event._id} event={event} />;
        })}
      </div>
    </div>
  );
};

export default EventsTab;
