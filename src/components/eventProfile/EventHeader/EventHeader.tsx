"use client";
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import EventStatus from "@/components/common/eventStatus/EventStatus";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploadertempname/ProfilePictureUploader";
import { Image } from "@/types/image";
import { getEventDisplayInfo } from "@/utils/eventDates";
import styles from "./EventHeader.module.scss";
import Button from "@/components/common/buttons/Button";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/buttons/BackButton";
import { capitalizeFirstLetter } from "@/utils/functions";
import { EventHeaderProps } from "./EventHeader.types";

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const eventDisplayInfo = getEventDisplayInfo(event.schedule || []);
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
          <EventStatus status={eventDisplayInfo.status} />
          <div className={styles.dateInfo}>
            <p className={styles.dateText}>
              {eventDisplayInfo.formattedDateRange}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.titleRow}>
          <Calendar size={18} className={styles.icon} />
          <h1 className={styles.title}>{capitalizeFirstLetter(event.name)}</h1>
        </div>
        <Button
          variant="simple"
          className={styles.locationButton}
          onClick={() => router.push(`/places/${event.place._id}`)}
          startIcon={<MapPin size={14} />}
          ariaLabel="Voir le lieu"
        >
          {event.place.name}
        </Button>
      </div>
    </header>
  );
};

export default EventHeader;
