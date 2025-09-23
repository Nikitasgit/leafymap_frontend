import React from "react";
import { MapPin } from "lucide-react";
import Text from "@/components/common/typography/Text";

import { PlacePopulated } from "@/types/place";

import styles from "./PlaceCard.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";

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
          className={styles.placeImage}
        />
      </div>

      <div className={styles.placeInfo}>
        <div className={styles.placeHeader}>
          <div className={styles.placeTitle}>
            <MapPin size={18} className={styles.placeIcon} />
            <Text as="h3">{place.name}</Text>
          </div>
        </div>

        <div className={styles.placeContent}>
          {place.description && (
            <Text as="p" className={styles.description}>
              {place.description.length > 120
                ? `${place.description.substring(0, 120)}...`
                : place.description}
            </Text>
          )}

          <div className={styles.placeDetails}>
            <Text as="p" className={styles.locationName}>
              {place.location?.label}
            </Text>
            <SubscribersCounter
              title="Abonnés"
              followers={place.followers?.length || 0}
              withIcon={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
