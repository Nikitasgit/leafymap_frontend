import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import Schedule from "@/components/common/schedule";
import styles from "./PlaceCardMap.module.scss";
import { MapPin, Heart, Star } from "lucide-react";
import { usePlace } from "@/hooks/usePlace";

const PlaceCardMap = ({ placeId }: { placeId: string }) => {
  const { place, loading, error } = usePlace(placeId, true);

  const [displayPlace, setDisplayPlace] = useState(place);

  useEffect(() => {
    if (place) {
      setDisplayPlace(place);
    }
  }, [place]);

  if (!displayPlace && loading) return <div>Loading...</div>;
  if (error && !displayPlace) return <div>Error: {error}</div>;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${styles.star} ${
          index < rating ? styles.filled : styles.empty
        }`}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div className={styles.placeCardMap}>
      <div className={styles.imageContainer}>
        <Image
          src={displayPlace?.image || "/images/default-place.png"}
          alt={displayPlace?.name || "Place image"}
          width={100}
          height={200}
          className={styles.currentImage}
        />
      </div>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>{displayPlace?.name}</h2>
          <div className={styles.categoryRow}>
            {displayPlace?.placeCategory && (
              <Text className={styles.category}>
                {displayPlace.placeCategory.name}
              </Text>
            )}
            <div className={styles.ratingRow}>
              <Heart size={16} className={styles.heartIcon} />
              <span className={styles.rating}>{displayPlace?.rating}</span>
              <div className={styles.starsContainer}>
                {renderStars(displayPlace?.rating || 0)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <div className={styles.buttonGroup}>
            <Button variant="secondary">Itinéraire</Button>
            <Button variant="primary">Favoris</Button>
          </div>
        </div>
        <div className={styles.addressRow}>
          <span className={styles.addressIcon}>
            <MapPin size={14} />
          </span>
          <Text className={styles.address}>{displayPlace?.location.label}</Text>
        </div>
      </div>
      <div className={styles.descriptionRow}>
        <Text>{displayPlace?.description}</Text>
      </div>
      {displayPlace?.defaultSchedule && (
        <Schedule schedule={displayPlace?.defaultSchedule} />
      )}
    </div>
  );
};

export default PlaceCardMap;
