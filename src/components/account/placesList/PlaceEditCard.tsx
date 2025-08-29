import Button from "@/components/common/buttons/button/Button";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import { Edit3 } from "lucide-react";
import styles from "./PlaceEditCard.module.scss";
import useSubmitPlace from "@/hooks/useSubmitPlace";
import { Image } from "@/types/image";

const PlaceEditCard = ({ place }: { place: Place }) => {
  const router = useRouter();
  const { submitPlace, isLoading: isLoadingPlace } = useSubmitPlace();

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
          <Button
            variant="simple"
            onClick={() => router.push(`account/places/${place._id}`)}
            className={styles.editIcon}
            aria-label="Modifier"
          >
            <Edit3 size={16} />
          </Button>
        </div>
        <Text as="p" className={styles.description}>
          {place.description}
        </Text>
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            onClick={() => router.push(`account/places/${place._id}/events`)}
          >
            Voir les événements
          </Button>
          <Button
            variant="secondary"
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
