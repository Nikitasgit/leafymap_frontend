"use client";
import React from "react";
import BaseModal from "@/components/common/modals/BaseModal/BaseModal";
import EventCard from "@/components/common/events/EventCard/EventCard";
import UsersListXScroll from "@/components/common/users/UsersListXScroll";
import { useEventInvitations } from "@/hooks/useEventInvitations";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import styles from "./EventModal.module.scss";
import EventSchedule from "@/components/eventProfile/EventSchedule";
import { capitalizeFirstLetter } from "@/utils/functions";
import { UsersListXScrollUser } from "../../users/UsersListXScroll/UsersListXScroll";

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
  isContentLoading?: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  place,
  user,
  isContentLoading = false,
}) => {
  const { eventInvitations, isLoading: eventInvitationsLoading } =
    useEventInvitations(event._id, { onlyAccepted: "true" });
  const participants = eventInvitations.map(
    (invitation) => invitation.collaborator
  );
  const handleClose = () => {
    onClose();
  };

  const hasSchedule =
    event.schedule &&
    Array.isArray(event.schedule) &&
    event.schedule.length > 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={capitalizeFirstLetter(event.name)}
      primaryButtonLabel="Fermer"
      onPrimaryAction={handleClose}
      withFooter={false}
      isContentLoading={eventInvitationsLoading || isContentLoading}
    >
      <div className={styles.eventModalContent}>
        <div className={styles.eventCardContainer}>
          <EventCard
            event={event}
            place={place}
            user={user}
            clickable={false}
          />
        </div>

        {participants.length > 0 && (
          <UsersListXScroll
            users={participants as UsersListXScrollUser[]}
            title="Participants"
            showCategory
            showChevrons
          />
        )}

        {hasSchedule && (
          <EventSchedule schedule={event.schedule} users={participants} />
        )}
      </div>
    </BaseModal>
  );
};

export default EventModal;
