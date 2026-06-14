import { EventPopulated } from "@/types/place/event";
import React, { useState } from "react";
import styles from "./EventSuggestionCard.module.scss";
import Image from "next/image";
import { MapPin } from "lucide-react";
import eventDefaultSvg from "@public/images/event_default.svg";
import { formatEventDateRangeCard } from "@/utils/dates";
import EventModal from "@/components/common/modals/EventModal";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";

const EventSuggestionCard = ({ event }: { event: EventPopulated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateRangeLabel = event.dateRange
    ? formatEventDateRangeCard(event.dateRange)
    : "";

  const place =
    typeof event.place === "object" ? (event.place as PlacePopulated) : undefined;

  const user = (event as unknown as { user?: UserPopulated }).user;

  const locationLabel =
    event.online ? "En ligne" : event.location?.label || place?.location?.label;

  return (
    <>
      <div
        className={styles.eventSuggestionCard}
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
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
      </div>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={event}
          place={place}
          user={user}
        />
      )}
    </>
  );
};

export default EventSuggestionCard;
