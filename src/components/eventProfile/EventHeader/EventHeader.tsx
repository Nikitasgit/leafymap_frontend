"use client";
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import EventStatus from "@/components/common/events/EventStatus";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploader/ProfilePictureUploader";
import { Image } from "@/types/image";
import DateRange from "@/components/common/dateRange";
import styles from "./EventHeader.module.scss";
import Button from "@/components/common/buttons/Button";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/buttons/BackButton";
import { capitalizeFirstLetter } from "@/utils/functions";
import { EventHeaderProps } from "./EventHeader.types";
import StarsDisplay from "@/components/common/stars/StarsDisplay/StarsDisplay";

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const router = useRouter();
  return (
    <header className={styles.header}>
      <BackButton />
      <div className={styles.topRow}>
        <ProfilePictureUploader
          type="Event"
          className={styles.eventImage}
          reference={event._id}
          initialImage={event.image as Image}
          size="medium"
          isOwner={false}
        />
        <div className={styles.programInfo}>
          {event.rating > 0 && (
            <div className={styles.rating}>
              <StarsDisplay rating={event.rating} size="small" />
              <span className={styles.ratingValue}>
                ({event.rating.toFixed(1)})
              </span>
            </div>
          )}
          <EventStatus status={event.lifecycleStatus} />
          <div className={styles.dateInfo}>
            <p className={styles.dateText}>
              <DateRange dateRange={event.dateRange} />
            </p>
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.titleRow}>
          <Calendar size={18} className={styles.icon} />
          <h1 className={styles.title}>{capitalizeFirstLetter(event.name)}</h1>
        </div>
        {(() => {
          const place = typeof event.place === "object" ? event.place : null;
          const user =
            place && typeof place.user === "object" ? place.user : null;
          return user ? (
            <Button
              variant="simple"
              className={styles.locationButton}
              onClick={() => router.push(`/users/${user._id}`)}
              startIcon={<MapPin size={14} />}
              ariaLabel="Voir le profil"
            >
              {user.username}
            </Button>
          ) : null;
        })()}
      </div>
    </header>
  );
};

export default EventHeader;
