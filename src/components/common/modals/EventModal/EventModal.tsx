"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "@/components/common/modals/BaseModal";
import Button from "@/components/common/buttons/Button";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import styles from "./EventModal.module.scss";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventDetails from "@/components/eventProfile/EventDetails";

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
  const { t } = useTranslation("common");
  const router = useRouter();
  const eventPlace =
    typeof event.place === "object" && event.place
      ? (event.place as PlacePopulated)
      : undefined;
  const eventUser =
    typeof event.user === "object" && event.user
      ? (event.user as UserPopulated)
      : undefined;

  const handleClose = () => {
    onClose();
  };

  const goToEventPage = () => {
    router.push(`/events/${event._id}`);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={capitalizeFirstLetter(event.name)}
      titleIcon={
        <span className={styles.titleIconBadge}>
          <CalendarDays size={18} />
        </span>
      }
      primaryButtonLabel={t("actions.close")}
      onPrimaryAction={handleClose}
      withFooter={false}
      isContentLoading={isContentLoading}
    >
      <div className={styles.eventModalContent}>
        <EventDetails
          event={event}
          place={place ?? eventPlace}
          user={user ?? eventUser}
          isContentLoading={isContentLoading}
        />
        <div className={styles.actionsRow}>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={goToEventPage}
            ariaLabel={t("eventModal.seeMoreAriaLabel")}
          >
            {t("actions.seeMore")}
          </Button>
          {event.isBookable && event.lifecycleStatus === "upcoming" && (
            <Button
              type="button"
              variant="primary"
              fullWidth
              startIcon={<Ticket size={16} />}
              onClick={goToEventPage}
              ariaLabel={t("eventModal.bookAriaLabel")}
            >
              {t("eventModal.book")}
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default EventModal;
