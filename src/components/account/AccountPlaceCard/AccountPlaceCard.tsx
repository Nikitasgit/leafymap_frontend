import Button from "@/components/common/buttons/Button";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploadertempname";
import { Edit3, Eye, Trash2 } from "lucide-react";
import styles from "./AccountPlaceCard.module.scss";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import useDeletePlace from "@/hooks/useDeletePlace";
import { Image } from "@/types/image";

const AccountPlaceCard = ({ place }: { place: Place }) => {
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
          <h4 className={styles.title}>{place.name}</h4>
          {!place.isCreatorPlace ? (
            <div className={styles.actionButtons}>
              {!place.isCreatorPlace && (
                <Button
                  variant="simple"
                  onClick={() => router.push(`/places/${place._id}`)}
                  aria-label="Voir le lieu"
                  disabled={isDeletingPlace}
                >
                  <Eye size={16} />
                </Button>
              )}
              <Button
                variant="simple"
                onClick={() => deletePlace(place._id)}
                aria-label="Supprimer"
                disabled={isDeletingPlace}
              >
                <Trash2 size={16} />
              </Button>
              <Button
                variant="simple"
                onClick={() => router.push(`account/places/${place._id}`)}
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
        <p className={styles.description}>{place.description}</p>
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

export default AccountPlaceCard;
