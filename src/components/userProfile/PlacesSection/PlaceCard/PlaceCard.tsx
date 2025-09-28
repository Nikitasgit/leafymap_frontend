import React from "react";
import { MapPin } from "lucide-react";

import { PlacePopulated } from "@/types/place";

import styles from "./PlaceCard.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";
import ReviewsCounter from "@/components/common/counters/ReviewCounter";

interface PlaceCardProps {
  place: PlacePopulated;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const router = useRouter();
  return (
    <div
      className={styles.placeCard}
      onClick={() => router.push(`/places/${place._id}`)}
    >
      <div className={styles.imageContainer}>
        <Image
          src={place.image?.urls?.thumbnail || "https://i.pravatar.cc/40?img=3"}
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
            <ReviewsCounter rating={place.rating || 0} />
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
    </div>
  );
};

export default PlaceCard;
