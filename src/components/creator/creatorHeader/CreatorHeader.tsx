import Image from "next/image";
import Button from "@/components/common/buttons/Button";
import styles from "./CreatorHeader.module.scss";
import { MapPin, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleGetDirections } from "@/utils/mapNavigation";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge/CreatorCategoryBadge";
import { capitalizeFirstLetter } from "@/utils/functions";
import placeDefaultSvg from "@public/images/place_default.svg";
import StarsDisplay from "@/components/common/stars/StarsDisplay/StarsDisplay";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { FollowButton } from "@/components/common/follow/FollowButton";
import { FollowingCount } from "@/components/common/follow/FollowingCount";
import { useState, useEffect } from "react";

export interface CreatorHeaderProps {
  place: Place | null;
  user: UserPopulated;
  isLoading: boolean;
  variant?: "compact" | "full";
  onMessageClick?: (user: UserPopulated) => void;
}

const CreatorHeader = ({
  place,
  user,
  isLoading,
  variant = "compact",
  onMessageClick,
}: CreatorHeaderProps) => {
  const router = useRouter();
  const [followersCount, setFollowersCount] = useState<number>(
    user.followers || 0
  );

  // Synchroniser le compteur avec les données utilisateur quand elles changent
  useEffect(() => {
    if (user.followers !== undefined) {
      setFollowersCount(user.followers);
    }
  }, [user.followers]);

  const handleFollowChange = (isFollowing: boolean) => {
    // Mise à jour optimiste du compteur
    setFollowersCount((prev) => (isFollowing ? prev + 1 : Math.max(0, prev - 1)));
  };
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
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              {capitalizeFirstLetter(user.username || "")}
            </h2>
            <FollowButton
              userId={user._id}
              onFollowChange={handleFollowChange}
            />
          </div>
          {(place || followersCount > 0) && (
            <div className={styles.categoryRow}>
              <div className={styles.categoryRowLeft}>
                {place && (
                  <PlaceCategoryBadge
                    categoryName={
                      typeof place.placeCategory === "object"
                        ? place.placeCategory.name || ""
                        : ""
                    }
                  />
                )}
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
                {followersCount > 0 && (
                  <FollowingCount count={followersCount} userId={user._id} />
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
        {(place || onMessageClick) && (
          <div className={styles.actionsWrapper}>
            <div className={styles.buttonGroup}>
              {onMessageClick && (
                <Button
                  ariaLabel="Envoyer un message"
                  variant="secondary"
                  type="button"
                  size="small"
                  onClick={() => onMessageClick(user)}
                  startIcon={<MessageSquare size={16} />}
                >
                  Message
                </Button>
              )}
              {place && (
                <Button
                  ariaLabel="Itinéraire"
                  variant="primary"
                  type="button"
              size="small"
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

export default CreatorHeader;
