import { Event } from "@/types/place/event";
import { useRouter } from "next/navigation";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploader";
import EventStatus from "@/components/common/events/EventStatus";
import { Calendar } from "lucide-react";
import DateRange from "@/components/common/dateRange";
import styles from "./AccountEventCard.module.scss";
import { Image } from "@/types/image";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import useDeleteEvent from "@/hooks/useDeleteEvent";
import ActionButtons from "@/components/common/actions/ActionButtons";

interface AccountEventCardProps {
  event: Event;
  placeId: string;
}

const AccountEventCard = ({ event, placeId }: AccountEventCardProps) => {
  const router = useRouter();
  const { submitEvent } = useSubmitEvent();
  const { deleteEvent, isLoading: isDeletingEvent } = useDeleteEvent();

  const handleImageUploaded = async (imageId: string | null) => {
    if (imageId && typeof imageId === "string") {
      await submitEvent(
        {
          image: imageId,
        },
        true,
        event._id
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
          <h4 className={styles.title}>{event.name}</h4>
          <ActionButtons
            actions={[
              {
                type: "view",
                onClick: () => router.push(`/events/${event._id}`),
                ariaLabel: "Voir l'événement",
              },
              {
                type: "delete",
                onClick: () => deleteEvent(event._id),
                ariaLabel: "Supprimer l'événement",
                disabled: isDeletingEvent,
              },
              {
                type: "edit",
                onClick: () =>
                  router.push(`/account/places/${placeId}/events/${event._id}`),
                ariaLabel: "Modifier l'événement",
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
        <p className={styles.description}>{event.description}</p>
      </div>
    </div>
  );
};

export default AccountEventCard;
