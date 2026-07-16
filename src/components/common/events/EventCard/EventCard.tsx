"use client";

import React from "react";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import EventStatus from "../EventStatus";
import DateRange from "@/components/common/dateRange";
import styles from "./EventCard.module.scss";
import Image from "next/image";
import { EventCardProps } from "./EventCard.types";
import eventDefaultsSvg from "@public/images/event_default.svg";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { getEventLocationLabel } from "@/lib/api/normalizers/resolveRef";

const EventCard: React.FC<EventCardProps> = ({ event, place, user }) => {
  const { t } = useTranslation("events");
  const eventPlace =
    typeof event.place === "object" && event.place
      ? (event.place as PlacePopulated)
      : undefined;
  const displayPlace = place ?? eventPlace;
  const eventUser =
    typeof event.user === "object" && event.user
      ? (event.user as UserPopulated)
      : undefined;
  const displayUser = user ?? eventUser;
  const locationLabel = event.online
    ? t("eventCard.online")
    : getEventLocationLabel(event) || displayPlace?.location?.label;
  const eventCategoryName =
    typeof event.eventCategory === "object"
      ? t(`common:eventCategories.${event.eventCategory.name}`, {
          defaultValue: event.eventCategory.name,
        })
      : "";

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
            {eventCategoryName && (
              <div className={styles.categoryInfo}>
                <Tag size={14} className={styles.detailIcon} />
                <p className={styles.detailText}>{eventCategoryName}</p>
              </div>
            )}
            {event.dateRange?.firstDate && (
              <div className={styles.dateInfo}>
                <Clock size={14} className={styles.detailIcon} />
                <p className={styles.detailText}>
                  <DateRange dateRange={event.dateRange} />
                </p>
              </div>
            )}
            {locationLabel && (
              <div className={styles.locationInfo}>
                <MapPin size={14} className={styles.detailIcon} />
                <div className={styles.locationDetails}>
                  {displayUser?.username && (
                    <p className={styles.locationName}>
                      {displayUser.username}
                    </p>
                  )}
                  <p className={styles.locationAddress}>{locationLabel}</p>
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
