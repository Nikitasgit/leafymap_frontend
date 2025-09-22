"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useEvent } from "@/hooks/useEvent";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import styles from "./eventPage.module.scss";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Text from "@/components/common/typography/Text";
import EventStatus from "@/components/common/eventStatus/EventStatus";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader/ProfilePictureUploader";
import { getEventDisplayInfo } from "@/utils/eventDates";
import { Image } from "@/types/image";
import EventSchedule from "@/components/events/eventSchedule/EventSchedule";

const EventPage = () => {
  const { eventId } = useParams();
  const router = useRouter();
  const { event, isLoading } = useEvent(eventId as string);

  if (isLoading) return <LoadingBar />;

  if (!event) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.errorState}>
          <Text as="h2">Événement non trouvé</Text>
          <Text as="p">
            L&apos;événement que vous recherchez n&apos;existe pas ou a été
            supprimé.
          </Text>
          <button className={styles.backButton} onClick={() => router.back()}>
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </main>
    );
  }
  const eventDisplayInfo = getEventDisplayInfo(event.schedule || []);

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className={styles.eventImage}>
          <ProfilePictureUploader
            type="Event"
            reference={event._id}
            initialImage={event.image as Image}
            size="large"
            isOwner={false}
          />
        </div>

        <div className={styles.eventHeader}>
          <div className={styles.eventTitle}>
            <Calendar size={20} className={styles.eventIcon} />
            <Text as="h1" className={styles.title}>
              {event.name}
            </Text>
          </div>
          <EventStatus status={eventDisplayInfo.status} />
        </div>

        {/* Dates */}
        {eventDisplayInfo.formattedDateRange && (
          <div className={styles.dateInfo}>
            <Clock size={18} className={styles.dateIcon} />
            <Text as="p" className={styles.dateText}>
              {eventDisplayInfo.formattedDateRange}
            </Text>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className={styles.description}>
            <Text as="p">{event.description}</Text>
          </div>
        )}

        {/* Lieu */}
        {event.place && (
          <div className={styles.locationInfo}>
            <MapPin size={18} className={styles.locationIcon} />
            <div className={styles.locationDetails}>
              <Text as="p" className={styles.locationName}>
                {event.place.name}
              </Text>
              {event.place.location && event.place.location.label && (
                <Text as="p" className={styles.locationAddress}>
                  {event.place.location.label}
                </Text>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.eventInfo}>
        {/* Programme de l'événement */}
        <EventSchedule schedule={event.schedule || []} />
      </div>
    </main>
  );
};

export default EventPage;
