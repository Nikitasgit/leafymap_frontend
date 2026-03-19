import Image from "next/image";
import styles from "./CreatorHeader.module.scss";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge/CreatorCategoryBadge";
import { capitalizeFirstLetter } from "@/utils/functions";
import placeDefaultSvg from "@public/images/place_default.svg";
import StarsDisplay from "@/components/common/stars/StarsDisplay/StarsDisplay";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { getPlaceCategoryName } from "@/utils/place";
import { FollowingCount } from "@/components/common/follow/FollowingCount";

export interface CreatorHeaderProps {
  place: Place | null;
  user: UserPopulated;
  isLoading: boolean;
  variant?: "compact" | "full";
}

const CreatorHeader = ({
  place,
  user,
  isLoading,
  variant = "compact",
}: CreatorHeaderProps) => {
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
            src={
              user.image?.urls.medium ||
              user.googlePictureUrl ||
              placeDefaultSvg
            }
            alt={user.username || "Lieu"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        )}
      </button>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              {capitalizeFirstLetter(user.username || "")}
            </h2>
            <FollowingCount count={user.followers ?? 0} userId={user._id} />
          </div>
          {place && (
            <div className={styles.categoryRow}>
              <div className={styles.categoryRowLeft}>
                <PlaceCategoryBadge
                  categoryName={getPlaceCategoryName(place.placeCategory)}
                />
              </div>
              <div className={styles.ratingFollowersRow}>
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
              </div>
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
            {user.userCategory?.userCategoryType === "creation" && (
              <CreatorCategoryBadge
                categoryName={user.userCategory?.name || ""}
              />
            )}
          </span>
        </div>
      </header>
    </div>
  );
};

export default CreatorHeader;
