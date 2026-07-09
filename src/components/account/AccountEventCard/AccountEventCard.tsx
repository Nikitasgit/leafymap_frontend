"use client";

import { Event } from "@/types/place/event";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploader";
import EventStatus from "@/components/common/events/EventStatus";
import { Calendar } from "lucide-react";
import DateRange from "@/components/common/dateRange";
import styles from "./AccountEventCard.module.scss";
import { Image } from "@/types/image";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import useDeleteEvent from "@/hooks/useDeleteEvent";
import ActionButtons from "@/components/common/actions/ActionButtons";
import { capitalizeFirstLetter } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface AccountEventCardProps {
  event: Event;
  placeId?: string;
}

const AccountEventCard = ({ event, placeId }: AccountEventCardProps) => {
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
        event._id,
      );
    }
  };
  return (
    <div className={styles.card}>
      <ProfilePictureUploader
        type="Event"
        reference={event._id}
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
                onClick: () => deleteEvent(event._id),
                ariaLabel: t("accountEventCard.deleteAriaLabel"),
                disabled: isDeletingEvent,
              },
              {
                type: "edit",
                onClick: () =>
                  router.push(
                    placeId
                      ? `/account/places/${placeId}/events/${event._id}`
                      : `/account/events/${event._id}`,
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
