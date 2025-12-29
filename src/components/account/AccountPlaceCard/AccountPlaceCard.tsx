import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Plus } from "lucide-react";
import styles from "./AccountPlaceCard.module.scss";
import ActionButtons from "@/components/common/actions/ActionButtons";
import useDeletePlace from "@/hooks/useDeletePlace";
import Image from "next/image";
import placeDefaultSvg from "@public/images/place_default.svg";
import Button from "@/components/common/buttons/Button";

const AccountPlaceCard = ({ place }: { place: Place }) => {
  const router = useRouter();
  const { deletePlace, isLoading: isDeletingPlace } = useDeletePlace();

  const placeUser = typeof place.user === "object" ? place.user : null;
  const placeDescription = place.description || placeUser?.description || "";
  const placeAddress = place.location?.label || "";

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={placeDefaultSvg}
          alt="Lieu"
          fill
          sizes="(max-width: 768px) 100vw, 120px"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <ActionButtons
            actions={[
              {
                type: "edit",
                onClick: () => router.push(`/account/places/${place._id}`),
                ariaLabel: "Modifier le lieu",
              },
              {
                type: "delete",
                onClick: () => deletePlace(place._id),
                ariaLabel: "Supprimer le lieu",
                disabled: isDeletingPlace,
              },
            ]}
            className={styles.actionButtons}
          />
        </div>
        <div className={styles.addressRow}>
          <MapPin size={14} className={styles.addressIcon} />
          <h4 className={styles.title}>{placeAddress}</h4>
        </div>
        {placeDescription && (
          <p className={styles.description}>{placeDescription}</p>
        )}
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => router.push(`/account/places/${place._id}/events`)}
            endIcon={<Calendar size={16} />}
            ariaLabel="Voir les événements"
          >
            Voir les événements
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              router.push(`/account/places/${place._id}/events/create`)
            }
            endIcon={<Plus size={16} />}
            ariaLabel="Ajouter un événement"
          >
            Ajouter un événement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPlaceCard;

