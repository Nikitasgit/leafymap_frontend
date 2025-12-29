import React from "react";
import { MapPin } from "lucide-react";
import { PlaceCardProps } from "./PlaceCard.types";
import styles from "./PlaceCard.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";
import placeDefaultsSvg from "@public/images/place_default.svg";

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const router = useRouter();
  return (
    <a
      className={styles.placeCard}
      onClick={() => {
        const user = typeof place.user === "object" ? place.user : null;
        if (user) {
          router.push(`/users/${user._id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <Image
          src={place.image?.urls?.thumbnail || placeDefaultsSvg}
          alt={place.name}
          fill
          className={styles.placeImagee}
        />
      </div>
      <div className={styles.placeInfo}>
        <div className={styles.placeHeader}>
          <div className={styles.placeTitle}>
            <MapPin size={18} className={styles.placeIcon} />
            <h3>{place.name}</h3>
          </div>
          <div className={styles.placeCounters}>
            <SubscribersCounter followers={place.followers?.length || 0} />
          </div>
        </div>

        <div className={styles.placeContent}>
          {place.description && (
            <p className={styles.description}>
              {place.description.length > 120
                ? `${place.description.substring(0, 120)}...`
                : place.description}
            </p>
          )}

          <div className={styles.placeDetails}>
            <p className={styles.locationName}>{place.location?.label}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PlaceCard;
