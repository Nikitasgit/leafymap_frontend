"use client";
import React from "react";
import BaseModal from "@/components/common/modals/BaseModal/BaseModal";
import EventCard from "@/components/common/events/EventCard/EventCard";

import UsersListXScroll from "@/components/common/users/UsersListXScroll";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import styles from "./EventModal.module.scss";
import EventSchedule from "@/components/eventProfile/EventSchedule";

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
  const placeId =
    place?._id || (typeof event.place === "object" ? event.place?._id : null);

  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    placeId || "",
    event._id,
    "event",
    { onlyAccepted: "true" }
  );

  const users = partnerships.map((partnership) => {
    return {
      _id: partnership.collaborator._id,
      name: partnership.collaborator.username,
      image: partnership.collaborator.image?.urls?.thumbnail,
      category: partnership.collaborator.userCategories?.[0]?.name,
    };
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={event.name}
      primaryButtonLabel="Fermer"
      onPrimaryAction={handleClose}
      withFooter={false}
      isContentLoading={partnershipsLoading || isContentLoading}
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

        {partnerships.length > 0 ? (
          <>
            <UsersListXScroll
              users={users}
              title="Participants"
              showCategory={true}
            />
            {event.schedule && event.schedule.length > 0 && (
              <EventSchedule schedule={event.schedule} users={users} />
            )}
          </>
        ) : null}
      </div>
    </BaseModal>
  );
};

export default EventModal;
