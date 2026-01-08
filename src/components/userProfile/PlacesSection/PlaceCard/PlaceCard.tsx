import React from "react";
import { MapPin, Tag } from "lucide-react";
import { PlaceCardProps } from "./PlaceCard.types";
import styles from "./PlaceCard.module.scss";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";
import ActionButtons from "@/components/common/actions/ActionButtons";
import creatorDefaultsSvg from "@public/images/creator_default.svg";

const PlaceCard: React.FC<PlaceCardProps> = ({ place, actions, user }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <a
      className={styles.placeCard}
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
          src={user?.image?.urls?.thumbnail || creatorDefaultsSvg}
          alt={user?.username || ""}
          fill
          className={styles.placeImagee}
        />
      </div>
      <div className={styles.placeInfo}>
        <div className={styles.placeHeader}>
          <div className={styles.placeTitle}>
            <MapPin size={18} className={styles.placeIcon} />
            <h3>{user?.username}</h3>
          </div>
          <div className={styles.placeHeaderActions}>
            {actions && actions.length > 0 && (
              <ActionButtons
                actions={actions}
                className={styles.actionButtons}
                iconSize={14}
              />
            )}
            <div className={styles.placeCounters}>
              <SubscribersCounter followers={place.followers?.length || 0} />
            </div>
          </div>
        </div>

        <div className={styles.placeContent}>
          {place.description && (
            <p className={styles.description}>{place.description}</p>
          )}

          <div className={styles.placeDetails}>
            {place.placeCategory && (
              <div className={styles.categoryInfo}>
                <Tag size={14} className={styles.detailIcon} />
                <p className={styles.detailText}>
                  {t(
                    `placeCategories.${place.placeCategory.name.toLowerCase()}`
                  )}
                </p>
              </div>
            )}
            {place.location && place.location.label && (
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

export default PlaceCard;
