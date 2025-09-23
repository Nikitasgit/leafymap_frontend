import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import Schedule from "@/components/common/schedule";
import styles from "./PlaceCardMap.module.scss";
import { MapPin } from "lucide-react";
import { usePlace } from "@/hooks/usePlace";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ExtendedMapRef } from "@/types/map";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import ReviewsCounter from "@/components/common/counters/reviewsCounter";

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
                  router.push(`/users/${place.user._id}`);
                } else {
                  router.push(`/places/${place?._id}`);
                }
              }}
              src={
                typeof place?.image === "object" && place?.image?.urls
                  ? place.image.urls.medium
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
                  {place.user.creatorCategories ? (
                    place.user.creatorCategories.map((category) => (
                      <Text key={category._id} as="span">
                        {t(`creatorCategories.${category.name}`)}
                      </Text>
                    ))
                  ) : (
                    <Text as="span">
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
              <ReviewsCounter rating={place?.rating || 0} />
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
