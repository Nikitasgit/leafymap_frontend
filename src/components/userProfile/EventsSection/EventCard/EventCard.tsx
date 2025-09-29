import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import EventStatus from "@/components/common/eventStatus/EventStatus";
import { getEventDisplayInfo } from "@/utils/eventDates";
import styles from "./EventCard.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EventCardProps } from "./EventCard.types";

const EventCard: React.FC<EventCardProps> = ({ event, place }) => {
  const eventDisplayInfo = getEventDisplayInfo(event.schedule || []);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event._id}`);
  };

  return (
    <a
      className={styles.eventCard}
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <Image
          src={event.image?.urls?.thumbnail || "https://i.pravatar.cc/40?img=3"}
          alt={event.name}
          width={60}
          height={60}
          className={styles.placeImage}
        />
      </div>
      <div className={styles.eventInfo}>
        <div className={styles.eventHeader}>
          <div className={styles.eventTitle}>
            <Calendar size={18} className={styles.eventIcon} />
            <h3>{event.name}</h3>
          </div>
          <EventStatus status={eventDisplayInfo.status} />
        </div>

        <div className={styles.eventContent}>
          {event.description && (
            <p className={styles.description}>{event.description}</p>
          )}

          <div className={styles.eventDetails}>
            {eventDisplayInfo.formattedDateRange && (
              <div className={styles.dateInfo}>
                <Clock size={14} className={styles.detailIcon} />
                <p className={styles.detailText}>
                  {eventDisplayInfo.formattedDateRange}
                </p>
              </div>
            )}
            {place && (
              <div className={styles.locationInfo}>
                <MapPin size={14} className={styles.detailIcon} />
                <div className={styles.locationDetails}>
                  <p className={styles.locationName}>{place.name}</p>
                  {place.location && place.location.label && (
                    <p className={styles.locationAddress}>
                      {place.location.label}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default EventCard;
