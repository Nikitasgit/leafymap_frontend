import Button from "@/components/common/buttons/Button";
import { Event } from "@/types/place/event";
import { useRouter } from "next/navigation";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploadertempname";
import EventStatus from "@/components/common/eventStatus";
import { Edit3, Calendar, Eye, Trash2 } from "lucide-react";
import { getEventDisplayInfo } from "@/utils/eventDates";
import styles from "./AccountEventCard.module.scss";
import { Image } from "@/types/image";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import useDeleteEvent from "@/hooks/useDeleteEvent";

interface AccountEventCardProps {
  event: Event;
  placeId: string;
}

const AccountEventCard = ({ event, placeId }: AccountEventCardProps) => {
  const router = useRouter();
  const { submitEvent } = useSubmitEvent();
  const { deleteEvent, isLoading: isDeletingEvent } = useDeleteEvent();

  const eventDisplayInfo = getEventDisplayInfo(event.schedule || []);
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
          <div className={styles.actionButtons}>
            <Button
              variant="simple"
              onClick={() => router.push(`/events/${event._id}`)}
              className={styles.viewIcon}
              ariaLabel="Voir l'événement"
            >
              <Eye size={15} />
            </Button>
            <Button
              variant="simple"
              onClick={() => deleteEvent(event._id, placeId)}
              className={styles.deleteIcon}
              ariaLabel="Supprimer l'événement"
              disabled={isDeletingEvent}
            >
              <Trash2 size={15} />
            </Button>
            <Button
              variant="simple"
              onClick={() =>
                router.push(`/account/places/${placeId}/events/${event._id}`)
              }
              className={styles.editIcon}
              ariaLabel="Modifier l'événement"
            >
              <Edit3 size={15} />
            </Button>
          </div>
        </div>
        {eventDisplayInfo.formattedDateRange && (
          <div className={styles.scheduleInfo}>
            <div className={styles.scheduleItem}>
              <Calendar size={14} />
              <p className={styles.scheduleText}>
                {eventDisplayInfo.formattedDateRange}
              </p>
              <EventStatus status={eventDisplayInfo.status} />
            </div>
          </div>
        )}
        <p className={styles.description}>{event.description}</p>
      </div>
    </div>
  );
};

export default AccountEventCard;
