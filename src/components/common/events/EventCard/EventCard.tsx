import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import EventStatus from "../EventStatus/EventStatus";
import DateRange from "@/components/common/dateRange";
import styles from "./EventCard.module.scss";
import Image from "next/image";
import { EventCardProps } from "./EventCard.types";
import eventDefaultsSvg from "@public/images/event_default.svg";

const EventCard: React.FC<EventCardProps> = ({
  event,
  place,
  user,
  clickable = true,
}) => {
  return (
    <div className={styles.eventCard}>
      <div className={styles.imageContainer}>
        <Image
          src={event.image?.urls?.thumbnail || eventDefaultsSvg}
          alt={event.name}
          width={80}
          height={80}
          className={styles.placeImage}
        />
      </div>
      <div className={styles.eventInfo}>
        <div className={styles.eventHeader}>
          <div className={styles.eventTitle}>
            <Calendar size={18} className={styles.eventIcon} />
            <h3>{event.name}</h3>
          </div>
          <EventStatus status={event.lifecycleStatus} />
        </div>

        <div className={styles.eventContent}>
          {event.description && (
            <p className={styles.description}>{event.description}</p>
          )}

          <div className={styles.eventDetails}>
            {event.dateRange?.firstDate && (
              <div className={styles.dateInfo}>
                <Clock size={14} className={styles.detailIcon} />
                <p className={styles.detailText}>
                  <DateRange dateRange={event.dateRange} />
                </p>
              </div>
            )}
            {place && (
              <div className={styles.locationInfo}>
                <MapPin size={14} className={styles.detailIcon} />
                <div className={styles.locationDetails}>
                  <p className={styles.locationName}>{user?.username}</p>
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
    </div>
  );
};

export default EventCard;
