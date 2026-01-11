"use client";
import React from "react";
import BaseModal from "@/components/common/modals/BaseModal/BaseModal";
import EventCard from "@/components/common/events/EventCard/EventCard";
import EventSchedule from "@/components/eventProfile/EventSchedule/EventSchedule";
import UsersListXScroll from "@/components/common/users/UsersListXScroll";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { PartnershipPopulated } from "@/types/partnerships";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import styles from "./EventModal.module.scss";

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  place,
  user,
}) => {
  const placeId =
    place?._id || (typeof event.place === "object" ? event.place?._id : null);

  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    placeId || "",
    event._id,
    "event",
    { onlyAccepted: "true" }
  );
  console.log(partnerships);
  const handleClose = () => {
    onClose();
  };
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      primaryButtonLabel="Fermer"
      onPrimaryAction={handleClose}
      primaryButtonType="button"
      secondaryButtonLabel={undefined}
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

        {partnershipsLoading ? (
          <LoadingBar />
        ) : (
          <>
            {(() => {
              if (partnerships.length === 0) return null;

              const users = (partnerships as any[]).map((partnership) => {
                const collaborator = partnership.collaborator;
                return {
                  _id: collaborator._id,
                  name: collaborator.username,
                  image: collaborator.image?.urls?.thumbnail,
                  category: collaborator.userCategories?.[0]?.name,
                };
              });

              return (
                <UsersListXScroll
                  users={users}
                  title="Participants"
                  showCategory={true}
                />
              );
            })()}

            {event.schedule && event.schedule.length > 0 && (
              <EventSchedule
                schedule={event.schedule}
                partnerships={partnerships as PartnershipPopulated[]}
              />
            )}
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default EventModal;
