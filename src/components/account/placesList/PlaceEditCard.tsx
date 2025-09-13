import Button from "@/components/common/buttons/button/Button";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import { Edit3, Trash2 } from "lucide-react";
import styles from "./PlaceEditCard.module.scss";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import useDeletePlace from "@/hooks/useDeletePlace";
import { Image } from "@/types/image";

const PlaceEditCard = ({ place }: { place: Place }) => {
  const router = useRouter();
  const { submitPlace, isLoading: isLoadingPlace } = useSubmitPlace();
  const { deletePlace, isLoading: isDeletingPlace } = useDeletePlace();

  const handleImageUploaded = async (imageId: string | null) => {
    if (imageId) {
      await submitPlace(
        {
          image: imageId,
        },
        true,
        place._id
      );
    }
  };

  return (
    <div className={styles.card}>
      <ProfilePictureUploader
        onImageUploaded={handleImageUploaded}
        type="Place"
        reference={place._id}
        initialImage={place.image as Image}
        isOwner={true}
        size="medium"
        disabled={isLoadingPlace}
      />

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <Text as="h4" className={styles.title}>
            {place.name}
          </Text>
          {!place.isCreatorPlace ? (
            <div className={styles.actionButtons}>
              <Button
                variant="simple"
                onClick={() => deletePlace(place._id)}
                className={styles.deleteIcon}
                aria-label="Supprimer"
                disabled={isDeletingPlace}
              >
                <Trash2 size={16} />
              </Button>
              <Button
                variant="simple"
                onClick={() => router.push(`account/places/${place._id}`)}
                className={styles.editIcon}
                aria-label="Modifier"
              >
                <Edit3 size={16} />
              </Button>
            </div>
          ) : (
            <span
              className={`${styles.placeStatus} ${
                styles[place.active ? "active" : "inactive"]
              }`}
            >
              {place.active ? "visible" : "désactivée"}
            </span>
          )}
        </div>
        <Text as="p" className={styles.description}>
          {place.description}
        </Text>
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => router.push(`account/places/${place._id}/events`)}
          >
            Voir les événements
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              router.push(`account/places/${place._id}/events/create`)
            }
          >
            Ajouter un événement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceEditCard;
