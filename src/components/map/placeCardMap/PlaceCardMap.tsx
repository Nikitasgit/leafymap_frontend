import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import Schedule from "@/components/common/schedule";
import styles from "./PlaceCardMap.module.scss";
import { MapPin, Heart, Star } from "lucide-react";
import { usePlace } from "@/hooks/usePlace";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ExtendedMapRef } from "@/types/map";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";

interface PlaceCardMapProps {
  placeId: string;
  mapRef: React.RefObject<ExtendedMapRef | null>;
}

const PlaceCardMap = ({ placeId, mapRef }: PlaceCardMapProps) => {
  const { place, isLoading } = usePlace(placeId, true);
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    if (mapRef.current && place) {
      navigateToPlaceOnMap({
        mapRef,
        placeId: place._id,
        coordinates: place.location?.coordinates || [],
      });
    }
  }, [mapRef, place]);

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
      <div>
        <div
          className={`${styles.imageContainer} ${isLoading ? "skeleton" : ""}`}
        >
          {!isLoading && (
            <Image
              onClick={() => {
                if (place?.isCreatorPlace) {
                  const userId =
                    typeof place.userId === "string"
                      ? place.userId
                      : place.userId._id;
                  router.push(`/users/${userId}`);
                } else {
                  router.push(`/places/${place?._id}`);
                }
              }}
              src={
                place?.image?.urls
                  ? place?.image.urls.medium
                  : "/images/default-event.png"
              }
              alt={place?.name || "Place image"}
              width={100}
              height={200}
        
            />
          )}
        </div>
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <h2 className={styles.title}>{place?.name}</h2>
            <div className={styles.categoryRow}>
              {place?.placeCategory && (
                <Text className={styles.category}>
                  {place.creatorCategories ? (
                    place.creatorCategories.map((category) => (
                      <Text key={category._id}>
                        {t(`creatorCategories.${category.name}`)}
                      </Text>
                    ))
                  ) : (
                    <Text>
                      {t(
                        `placeCategories.${
                          typeof place.placeCategory === "object"
                            ? place.placeCategory?.name
                            : place.placeCategory
                        }`
                      )}
                    </Text>
                  )}
                </Text>
              )}
              <div className={styles.ratingRow}>
                <Heart size={16} className={styles.heartIcon} />
                <span className={styles.rating}>{place?.rating}</span>
                <div className={styles.starsContainer}>
                  {renderStars(place?.rating || 0)}
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
            <Text className={styles.address}>{place?.location?.label}</Text>
          </div>
        </div>
        <div className={styles.descriptionRow}>
          <Text>{place?.description}</Text>
        </div>
        {place?.defaultSchedule && (
          <Schedule schedule={place?.defaultSchedule} />
        )}
      </div>
    </div>
  );
};

export default PlaceCardMap;
