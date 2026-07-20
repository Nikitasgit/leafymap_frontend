"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import EventCard from "@/components/common/events/EventCard";
import UsersListXScroll, {
  UsersListXScrollUser,
} from "@/components/common/users/UsersListXScroll";
import EventSchedule from "@/components/eventProfile/EventSchedule";
import { useEventInvitations } from "@/hooks/useEventInvitations";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import styles from "./EventDetails.module.scss";
import { CreatorCard } from "@/components/userProfile/PlacesSection/CreatorCard";

export interface EventDetailsProps {
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
  isContentLoading?: boolean;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  place,
  user,
  isContentLoading = false,
}) => {
  const { t } = useTranslation("events");
  const { eventInvitations, isLoading: eventInvitationsLoading } =
    useEventInvitations(event.id, { onlyAccepted: "true" });

  const participants = eventInvitations
    .map((invitation) => invitation.collaborator)
    .filter(
      (collaborator): collaborator is NonNullable<typeof collaborator> =>
        collaborator !== undefined,
    );
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
          users={participants as UsersListXScrollUser[]}
          title={t("eventDetails.participants")}
          showCategory
          showChevrons
          loading={eventInvitationsLoading || isContentLoading}
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
