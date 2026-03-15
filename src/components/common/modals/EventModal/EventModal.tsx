"use client";
import React from "react";
import BaseModal from "@/components/common/modals/BaseModal/BaseModal";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import styles from "./EventModal.module.scss";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventDetails from "@/components/eventProfile/EventDetails/EventDetails";

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
  const handleClose = () => {
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={capitalizeFirstLetter(event.name)}
      primaryButtonLabel="Fermer"
      onPrimaryAction={handleClose}
      withFooter={false}
      isContentLoading={isContentLoading}
    >
      <div className={styles.eventModalContent}>
        <EventDetails
          event={event}
          place={place}
          user={user}
          isContentLoading={isContentLoading}
        />
      </div>
    </BaseModal>
  );
};

export default EventModal;
