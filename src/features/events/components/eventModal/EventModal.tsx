"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "@/shared/ui/modals/baseModal";
import Button from "@/shared/ui/buttons/button";
import { EventPopulated } from "../../types/event";
import { PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";
import styles from "./EventModal.module.scss";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import EventDetails from "../eventDetails";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

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
    (resolveRefObject(event.place) as PlacePopulated | null) ?? undefined;
  const eventUser =
    (resolveRefObject(event.user) as UserPopulated | null) ?? undefined;

  const handleClose = () => {
    onClose();
  };

  const goToEventPage = () => {
    router.push(`/events/${event.id}`);
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
