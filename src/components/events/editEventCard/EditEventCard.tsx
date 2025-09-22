import Button from "@/components/common/buttons/button/Button";
import { Event } from "@/types/place/event";
import { useRouter } from "next/navigation";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import EventStatus from "@/components/common/eventStatus/EventStatus";
import { Edit3, Calendar, Eye, Trash2 } from "lucide-react";
import { getEventDisplayInfo } from "@/utils/eventDates";
import styles from "./EditEventCard.module.scss";
import { Image } from "@/types/image";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import useDeleteEvent from "@/hooks/useDeleteEvent";

interface EditEventCardProps {
  event: Event;
  placeId: string;
}

const EditEventCard = ({ event, placeId }: EditEventCardProps) => {
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
      />

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <Text as="h4" className={styles.title}>
            {event.name}
          </Text>
          <div className={styles.actionButtons}>
            <Button
              variant="simple"
              onClick={() => router.push(`/events/${event._id}`)}
              className={styles.viewIcon}
              aria-label="Voir l'événement"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="simple"
              onClick={() => deleteEvent(event._id, placeId)}
              className={styles.deleteIcon}
              aria-label="Supprimer"
              disabled={isDeletingEvent}
            >
              <Trash2 size={16} />
            </Button>
            <Button
              variant="simple"
              onClick={() =>
                router.push(`/account/places/${placeId}/events/${event._id}`)
              }
              className={styles.editIcon}
              aria-label="Modifier"
            >
              <Edit3 size={16} />
            </Button>
          </div>
        </div>

        <Text as="p" className={styles.description}>
          {event.description}
        </Text>

        {eventDisplayInfo.formattedDateRange && (
          <div className={styles.scheduleInfo}>
            <div className={styles.scheduleItem}>
              <Calendar size={14} />
              <Text as="p" className={styles.scheduleText}>
                {eventDisplayInfo.formattedDateRange}
              </Text>
              <EventStatus status={eventDisplayInfo.status} />
            </div>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/account/places/${placeId}/events/${event._id}`)
            }
          >
            Modifier l&apos;événement
          </Button>
          {event.partnerships && event.partnerships.length > 0 && (
            <Button
              variant="simple"
              onClick={() =>
                router.push(`/account/places/${placeId}/events/${event._id}`)
              }
            >
              {event.partnerships.length} partenaire
              {event.partnerships.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEventCard;
