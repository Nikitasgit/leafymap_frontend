import { EventPopulated } from "@/types/place/event";
import React from "react";
import styles from "./EventSuggestionCard.module.scss";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import eventDefaultSvg from "@public/images/event_default.svg";
import { formatEventDateRangeCard } from "@/utils/dates";

const EventSuggestionCard = ({ event }: { event: EventPopulated }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/events/${event._id}`);
  };

  const dateRangeLabel = event.dateRange
    ? formatEventDateRangeCard(event.dateRange)
    : "";
  const locationLabel =
    typeof event.place === "object" && event.place?.location?.label
      ? event.place.location.label
      : null;

  return (
    <a
      className={styles.eventSuggestionCard}
      onClick={handleRedirect}
      role="link"
      tabIndex={0}
    >
      {dateRangeLabel && (
        <div className={styles.dateBanner}>{dateRangeLabel}</div>
      )}
      <div className={styles.imageContainer}>
        <Image
          src={
            typeof event.image === "object" && event.image?.urls?.medium
              ? event.image.urls.medium
              : eventDefaultSvg
          }
          alt={event.name}
          fill
          sizes="(min-width: 768px) 320px, (min-width: 576px) 280px, 240px"
          className={styles.image}
          style={{ objectFit: "cover" }}
        />
        {locationLabel && (
          <div className={styles.locationOverlay}>
            <span className={styles.locationText}>{locationLabel}</span>
            <MapPin size={16} className={styles.locationIcon} />
          </div>
        )}
        <div className={styles.titleOverlay}>
          <span className={styles.titleText}>{event.name}</span>
        </div>
      </div>
    </a>
  );
};

export default EventSuggestionCard;
