import Button from "@/components/common/buttons/button/Button";
import { Event } from "@/types/place/event";
import { useRouter } from "next/navigation";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import { Edit3, Calendar, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getEventDateRange } from "@/utils/eventDates";
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

  const getEventStatus = (status: string) => {
    switch (status) {
      case "upcoming":
        return { label: "À venir", color: "upcoming" };
      case "ongoing":
        return { label: "En cours", color: "ongoing" };
      case "completed":
        return { label: "Terminé", color: "completed" };
      case "cancelled":
        return { label: "Annulé", color: "cancelled" };
      case "full":
        return { label: "Complet", color: "full" };
      case "unvalid":
        return { label: "Dates invalides", color: "unvalid" };
      default:
        return { label: "À venir", color: "upcoming" };
    }
  };

  const statusDisplay = getEventStatus(event.status);
  const dateRange = getEventDateRange(event.schedule || []);
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
              onClick={() =>
                router.push(`/places/${placeId}?event=${event._id}`)
              }
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

        {dateRange.firstDate && (
          <div className={styles.scheduleInfo}>
            <div className={styles.scheduleItem}>
              <Calendar size={14} />
              <Text as="p" className={styles.scheduleText}>
                {format(new Date(dateRange.firstDate), "dd MMM yyyy", {
                  locale: fr,
                })}
                {dateRange.latestDate &&
                  dateRange.latestDate !== dateRange.firstDate && (
                    <>
                      {" "}
                      -{" "}
                      {format(new Date(dateRange.latestDate), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </>
                  )}
              </Text>
              <span
                className={`${styles.status} ${styles[statusDisplay.color]}`}
              >
                {statusDisplay.label}
              </span>
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
