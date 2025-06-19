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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPlace, setNextPlace] = useState(place);

  useEffect(() => {
    if (place && place !== displayPlace) {
      // Set the next place immediately
      setNextPlace(place);
      // Start transition
      setIsTransitioning(true);

      // Faster transition - wait less time
      const timer = setTimeout(() => {
        setDisplayPlace(place);
        setIsTransitioning(false);
      }, 100); // Reduced from 150ms to 100ms

      return () => clearTimeout(timer);
    }
  }, [place, displayPlace]);

  // Show loading state only when we don't have any place to display
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
    <div
      className={`${styles.placeCardMap} ${
        isTransitioning ? styles.fadeOut : styles.fadeIn
      }`}
    >
      <div className={styles.imageContainer}>
        <Image
          src={displayPlace?.image || "/images/default-place.png"}
          alt={displayPlace?.name || "Place image"}
          width={100}
          height={200}
          className={styles.currentImage}
        />
        {isTransitioning &&
          nextPlace &&
          nextPlace.image !== displayPlace?.image && (
            <Image
              src={nextPlace.image || "/images/default-place.png"}
              alt={nextPlace.name || "Place image"}
              width={100}
              height={200}
              className={styles.nextImage}
            />
          )}
      </div>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>{displayPlace?.name}</h2>
        </div>
        <div className={styles.buttons}>
          <div className={styles.ratingRow}>
            <Heart size={16} className={styles.heartIcon} />
            <span className={styles.rating}>{displayPlace?.rating}</span>
            <div className={styles.reviewsInline}>
              <div className={styles.starsContainer}>
                {renderStars(displayPlace?.rating || 0)}
              </div>
              <span className={styles.reviewCount}>
                ({displayPlace?.["reviewCount"] ?? 0})
              </span>
            </div>
          </div>
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
