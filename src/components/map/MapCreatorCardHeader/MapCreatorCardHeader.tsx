import Image from "next/image";
import Button from "@/components/common/buttons/Button";
import WebsiteButton from "@/components/common/buttons/WebsiteButton";
import styles from "./MapCreatorCardHeader.module.scss";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleGetDirections } from "@/utils/mapNavigation";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge/CreatorCategoryBadge";
import { capitalizeFirstLetter } from "@/utils/functions";
import placeDefaultSvg from "@public/images/place_default.svg";
import StarsDisplay from "@/components/common/stars/StarsDisplay/StarsDisplay";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface MapCreatorCardHeaderProps {
  place: Place | null;
  user: UserPopulated;
  isLoading: boolean;
  variant?: "compact" | "full";
}

const MapCreatorCardHeader = ({
  place,
  user,
  isLoading,
  variant = "compact",
}: MapCreatorCardHeaderProps) => {
  const router = useRouter();
  return (
    <div
      className={`${styles.headerWrapper} ${
        variant === "full" ? styles.fullWidth : ""
      }`}
    >
      <button
        className={`${styles.imageContainer} ${isLoading ? "skeleton" : ""}`}
        onClick={() => {
          router.push(`/users/${user._id}`);
        }}
        type="button"
        aria-label={`Voir le profil de ${user.username || "l'utilisateur"}`}
      >
        {!isLoading && (
          <Image
            src={user.image?.urls.medium || placeDefaultSvg}
            alt={user.username || "Lieu"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        )}
      </button>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>
            {capitalizeFirstLetter(user.username || "")}
          </h2>
          {place && (
            <div className={styles.categoryRow}>
              <PlaceCategoryBadge
                categoryName={
                  typeof place.placeCategory === "object"
                    ? place.placeCategory.name || ""
                    : ""
                }
              />
            </div>
          )}
        </div>
        {place?.location?.label && (
          <div className={styles.addressRow}>
            <MapPin
              size={14}
              className={styles.addressIcon}
              aria-hidden="true"
            />
            <p className={styles.address}>{place.location.label}</p>
          </div>
        )}
        <div className={styles.ownerRow}>
          <span className={styles.ownerName}>
            Par:{" "}
            <b>
              {capitalizeFirstLetter(user.firstname || "")}{" "}
              {capitalizeFirstLetter(user.lastname || "")}
            </b>{" "}
            {user.userCategory &&
              user.userCategory.type?.name !== "organization" && (
              <CreatorCategoryBadge
                categoryName={user.userCategory?.name || ""}
              />
            )}
          </span>
        </div>
        {(place || user.website) && (
          <div className={styles.buttons}>
            {place?.rating != null &&
              typeof place.rating === "number" &&
              place.rating > 0 && (
                <div className={styles.ratingContainer}>
                  <StarsDisplay rating={place.rating} size="small" />
                  <span className={styles.ratingValue}>
                    ({place.rating.toFixed(1)})
                  </span>
                </div>
              )}
            <div className={styles.buttonGroup}>
              {user.website && (
                <WebsiteButton
                  website={user.website}
                  variant="secondary"
                  ariaLabel="Site web"
                />
              )}
              {place && (
                <Button
                  ariaLabel="Itinéraire"
                  variant="primary"
                  type="button"
                  onClick={() =>
                    handleGetDirections(place.location?.coordinates || [])
                  }
                >
                  Itinéraire
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default MapCreatorCardHeader;
