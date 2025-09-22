import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import Text from "@/components/common/typography/Text";
import EventStatus from "@/components/common/eventStatus/EventStatus";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader/ProfilePictureUploader";
import { Event } from "@/types/place/event";
import { Place } from "@/types/place";
import { getEventDisplayInfo } from "@/utils/eventDates";
import { Image } from "@/types/image";
import styles from "./EventCard.module.scss";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event;
  place?: Place;
}

const EventCard: React.FC<EventCardProps> = ({ event, place }) => {
  const eventDisplayInfo = getEventDisplayInfo(event.schedule || []);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event._id}`);
  };

  return (
    <div className={styles.eventCard} onClick={handleCardClick}>
      <ProfilePictureUploader
        type="Event"
        reference={event._id}
        initialImage={event.image as Image}
        size="medium"
        isOwner={false}
      />

      <div className={styles.eventInfo}>
        <div className={styles.eventHeader}>
          <div className={styles.eventTitle}>
            <Calendar size={18} className={styles.eventIcon} />
            <Text as="h3">{event.name}</Text>
          </div>
          <EventStatus status={eventDisplayInfo.status} />
        </div>

        <div className={styles.eventContent}>
          {event.description && (
            <Text as="p" className={styles.description}>
              {event.description.length > 120
                ? `${event.description.substring(0, 120)}...`
                : event.description}
            </Text>
          )}

          <div className={styles.eventDetails}>
            {eventDisplayInfo.formattedDateRange && (
              <div className={styles.dateInfo}>
                <Clock size={14} className={styles.detailIcon} />
                <Text as="p" className={styles.detailText}>
                  {eventDisplayInfo.formattedDateRange}
                </Text>
              </div>
            )}
            {place && (
              <div className={styles.locationInfo}>
                <MapPin size={14} className={styles.detailIcon} />
                <div className={styles.locationDetails}>
                  <Text as="p" className={styles.locationName}>
                    {place.name}
                  </Text>
                  {place.location && place.location.label && (
                    <Text as="p" className={styles.locationAddress}>
                      {place.location.label}
                    </Text>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
