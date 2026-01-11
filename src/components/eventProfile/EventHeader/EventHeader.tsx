"use client";
import React from "react";
import BackButton from "@/components/common/buttons/BackButton";
import { EventHeaderProps } from "./EventHeader.types";
import EventCard from "@/components/common/events/EventCard/EventCard";
import styles from "./EventHeader.module.scss";
import StarsDisplay from "@/components/common/stars/StarsDisplay/StarsDisplay";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  return (
    <header className={styles.header}>
      <BackButton />
      <div className={styles.eventCardWrapper}>
        <EventCard
          event={event}
          place={event.place as PlacePopulated}
          user={event.place?.user as UserPopulated}
          clickable={false}
        />
        {event.rating > 0 && (
          <div className={styles.rating}>
            <StarsDisplay rating={event.rating} size="small" />
            <span className={styles.ratingValue}>
              ({event.rating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default EventHeader;
