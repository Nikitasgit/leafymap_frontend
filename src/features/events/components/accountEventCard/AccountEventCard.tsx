"use client";

import { Event } from "../../types/event";
import ProfilePictureUploader from "@/shared/ui/inputs/profilePictureUploader";
import EventStatus from "../eventStatus";
import { Calendar } from "lucide-react";
import DateRange from "@/shared/ui/dateRange";
import styles from "./AccountEventCard.module.scss";
import { Image } from "@/shared/types/image";
import useSubmitEvent from "../../hooks/useSubmitEvent";
import useDeleteEvent from "../../hooks/useDeleteEvent";
import ActionButtons from "@/shared/ui/actions/actionButtons";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface AccountEventCardProps {
  event: Event;
  placeId?: string;
  onDeleted?: () => void;
}

const AccountEventCard = ({
  event,
  placeId,
  onDeleted,
}: AccountEventCardProps) => {
  const { t } = useTranslation("events");
  const { submitEvent } = useSubmitEvent();
  const { deleteEvent, isLoading: isDeletingEvent } = useDeleteEvent();
  const router = useRouter();

  const handleImageUploaded = async (imageId: string | null) => {
    if (imageId && typeof imageId === "string") {
      await submitEvent(
        {
          image: imageId,
        },
        true,
        event.id,
      );
    }
  };

  const handleDelete = async () => {
    const deleted = await deleteEvent(event.id);
    if (deleted) {
      onDeleted?.();
    }
  };

  return (
    <div className={styles.card}>
      <ProfilePictureUploader
        type="Event"
        reference={event.id}
        onImageUploaded={handleImageUploaded}
        initialImage={event.image as Image}
        isOwner
        size="medium"
        className={styles.imageContainer}
      />

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h4 className={styles.title}>{capitalizeFirstLetter(event.name)}</h4>
          <ActionButtons
            actions={[
              {
                type: "delete",
                onClick: handleDelete,
                ariaLabel: t("accountEventCard.deleteAriaLabel"),
                disabled: isDeletingEvent,
              },
              {
                type: "edit",
                onClick: () =>
                  router.push(
                    placeId
                      ? `/account/places/${placeId}/events/${event.id}`
                      : `/account/events/${event.id}`,
                  ),
                ariaLabel: t("accountEventCard.editAriaLabel"),
              },
            ]}
            className={styles.actionButtons}
          />
        </div>
        {event.dateRange?.firstDate && (
          <div className={styles.scheduleInfo}>
            <div className={styles.scheduleItem}>
              <Calendar size={14} />
              <p className={styles.scheduleText}>
                <DateRange dateRange={event.dateRange} />
              </p>
              <EventStatus status={event.lifecycleStatus} />
            </div>
          </div>
        )}
        <p className={styles.description}>
          {capitalizeFirstLetter(event.description)}
        </p>
      </div>
    </div>
  );
};

export default AccountEventCard;
