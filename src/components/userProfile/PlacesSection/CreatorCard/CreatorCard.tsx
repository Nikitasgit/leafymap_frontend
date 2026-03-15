import React from "react";
import { MapPin, Tag } from "lucide-react";
import { CreatorCardProps } from "./CreatorCard.types";
import styles from "./CreatorCard.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";
import ActionButtons from "@/components/common/actions/ActionButtons";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import creatorDefaultsSvg from "@public/images/creator_default.png";
import { getDisplayName } from "@/utils/userDisplay";

const CreatorCard: React.FC<CreatorCardProps> = ({ user, place, actions }) => {
  const router = useRouter();
  const displayName = getDisplayName(user);

  return (
    <a
      className={styles.creatorCard}
      onClick={() => {
        if (user) {
          router.push(`/users/${user._id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <Image
          src={
            user?.image?.urls?.thumbnail ||
            user?.googlePictureUrl ||
            creatorDefaultsSvg
          }
          alt={displayName}
          fill
          className={styles.cardImage}
        />
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <MapPin size={18} className={styles.cardIcon} />
            <h3>{displayName}</h3>
          </div>
          <div className={styles.cardHeaderActions}>
            {actions && actions.length > 0 && (
              <ActionButtons
                actions={actions}
                className={styles.actionButtons}
                iconSize={14}
              />
            )}
            <div className={styles.cardCounters}>
              <SubscribersCounter followers={place?.followers?.length ?? 0} />
            </div>
          </div>
        </div>

        <div className={styles.placeContent}>
          {place?.description && (
            <p className={styles.description}>{place.description}</p>
          )}

          <div className={styles.placeDetails}>
            {place?.placeCategory && (
              <div className={styles.categoryInfo}>
                <Tag size={14} className={styles.detailIcon} />
                <PlaceCategoryBadge
                  categoryName={
                    typeof place.placeCategory === "string"
                      ? place.placeCategory
                      : place.placeCategory.name
                  }
                />
              </div>
            )}
            {place?.location?.label && (
              <div className={styles.locationInfo}>
                <MapPin size={14} className={styles.detailIcon} />
                <p className={styles.detailText}>{place.location.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default CreatorCard;
