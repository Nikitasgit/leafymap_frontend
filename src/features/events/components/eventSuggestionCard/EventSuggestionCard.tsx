import { EventPopulated } from "../../types/event";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./EventSuggestionCard.module.scss";
import Image from "next/image";
import { MapPin } from "lucide-react";
import eventDefaultSvg from "@public/images/event_default.svg";
import { formatEventDateRangeCard } from "@/shared/utils/dates";
import EventModal from "../eventModal";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";
import type { PlacePopulated } from "@/features/places/types/place";
import type { UserPopulated } from "@/features/users/types";

const EventSuggestionCard = ({ event }: { event: EventPopulated }) => {
  const { t } = useTranslation("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateRangeLabel = event.dateRange
    ? formatEventDateRangeCard(event.dateRange)
    : "";

  const place =
    (resolveRefObject(event.place) as PlacePopulated | null) ?? undefined;

  const user =
    (resolveRefObject(event.user) as UserPopulated | null) ?? undefined;

  const locationLabel =
    event.online ? t("eventSuggestionCard.online") : event.location?.label || place?.location?.label;

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
            src={resolveRefObject(event.image)?.urls?.medium ?? eventDefaultSvg}
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
