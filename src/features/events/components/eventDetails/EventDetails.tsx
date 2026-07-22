"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import EventCard from "../eventCard";
import UsersListXScroll, {
  UsersListXScrollUser,
} from "@/features/users/components/usersListXScroll";
import EventSchedule from "../eventSchedule";
import { EventPopulated } from "../../types/event";
import { PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";
import styles from "./EventDetails.module.scss";
import CreatorCard from "@/features/users/components/creatorCard";

export interface EventDetailsProps {
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
  participants?: UsersListXScrollUser[];
  participantsLoading?: boolean;
  isContentLoading?: boolean;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  place,
  user,
  participants = [],
  participantsLoading = false,
  isContentLoading = false,
}) => {
  const { t } = useTranslation("events");
  const hasSchedule =
    event.schedule &&
    Array.isArray(event.schedule) &&
    event.schedule.length > 0;

  return (
    <div className={styles.eventDetailsContent}>
      <div className={styles.eventCardContainer}>
        <EventCard event={event} place={place} user={user} clickable={false} />
      </div>

      {participants.length > 0 && (
        <UsersListXScroll
          users={participants}
          title={t("eventDetails.participants")}
          showCategory
          showChevrons
          loading={participantsLoading || isContentLoading}
        />
      )}

      {user && (
        <section className={styles.organizerSection}>
          <h3 className={styles.sectionTitle}>{t("eventDetails.organizedBy")}</h3>
          {place ? (
            <CreatorCard user={user} place={place} actions={[]} />
          ) : (
            <p className={styles.organizerName}>{user.username}</p>
          )}
        </section>
      )}

      {hasSchedule && (
        <EventSchedule schedule={event.schedule} users={participants} />
      )}
    </div>
  );
};

export default EventDetails;
