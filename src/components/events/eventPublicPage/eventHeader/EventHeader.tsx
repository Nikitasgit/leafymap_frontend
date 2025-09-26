"use client";
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import EventStatus from "@/components/common/eventStatus/EventStatus";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader/ProfilePictureUploader";
import { Image } from "@/types/image";
import { Event } from "@/types/place/event";
import { getEventDisplayInfo } from "@/utils/eventDates";
import styles from "./EventHeader.module.scss";
import Button from "@/components/common/buttons/button/Button";
import { useRouter } from "next/navigation";

interface EventHeaderProps {
  event: Event;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const eventDisplayInfo = getEventDisplayInfo(event.schedule || []);
  const router = useRouter();
  return (
    <header className={styles.header}>
      <ProfilePictureUploader
        type="Event"
        className={styles.eventImage}
        reference={event._id}
        initialImage={event.image as Image}
        size="medium"
        isOwner={false}
      />
      <div className={styles.headerInfo}>
        <div className={styles.headerFirstRow}>
          <div className={styles.titleRow}>
            <Calendar size={18} className={styles.icon} />
            <h1 className={styles.title}>
              {event.name}
            </h1>
          </div>
          <EventStatus status={eventDisplayInfo.status} />
        </div>
        <div className={styles.dateInfo}>
          <p className={styles.dateText}>
            {eventDisplayInfo.formattedDateRange}
          </p>
        </div>
        <p className={styles.eventDescription}>
          {event.description}
        </p>
        <Button
          variant="simple"
          className={styles.locationButton}
          onClick={() => router.push(`/places/${event.place._id}`)}
          startIcon={<MapPin size={14} />}
        >
          {event.place.name}
        </Button>
      </div>
    </header>
  );
};

export default EventHeader;
