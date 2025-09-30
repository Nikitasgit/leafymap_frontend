import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import MapPlaceCardSchedule from "../MapPlaceCardSchedule";
import styles from "./MapPlaceCard.module.scss";
import { MapPin } from "lucide-react";
import { usePlace } from "@/hooks/usePlace";
import { useRouter } from "next/navigation";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import CreatorCategoryBadge from "@/components/common/users/creatorCategoryBadge";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import { MapPlaceCardProps } from "./MapPlaceCard.types";
import { capitalizeFirstLetter } from "@/utils/functions";

const MapPlaceCard = ({ placeId, mapRef }: MapPlaceCardProps) => {
  const { place, isLoading } = usePlace(placeId);
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
                place?.image?.urls.medium || "https://i.pravatar.cc/40?img=3"
              }
              alt={place?.name || "Place image"}
              width={100}
              height={200}
            />
          )}
        </div>
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <h2 className={styles.title}>
              {capitalizeFirstLetter(place?.name)}
            </h2>
            <div className={styles.categoryRow}>
              {place?.isCreatorPlace ? (
                <CreatorCategoryBadge
                  categoryName={place.user.creatorCategories[0].name}
                />
              ) : (
                <PlaceCategoryBadge
                  categoryName={place?.placeCategory?.name || ""}
                />
              )}
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.buttonGroup}>
              <Button ariaLabel="Itinéraire" variant="secondary">
                Itinéraire
              </Button>
              <Button ariaLabel="Favoris" variant="primary">
                Favoris
              </Button>
            </div>
          </div>
          <div className={styles.addressRow}>
            <span className={styles.addressIcon}>
              <MapPin size={14} />
            </span>
            <p className={styles.address}>{place?.location?.label}</p>
          </div>
        </div>
        <div className={styles.descriptionRow}>
          <p>{capitalizeFirstLetter(place?.description)}</p>
        </div>
        {place?.defaultSchedule && (
          <MapPlaceCardSchedule schedule={place?.defaultSchedule} />
        )}
      </div>
    </div>
  );
};

export default MapPlaceCard;
