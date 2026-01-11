import { useEffect, useMemo } from "react";
import styles from "./MapCreatorCard.module.scss";
import { useUser } from "@/hooks/useUser";
import { usePlace } from "@/hooks/usePlace";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import CreatorHeader from "@/components/creator/creatorHeader";
import MapCreatorCardContent from "../MapCreatorCardContent";

const MapCreatorCard = ({ userId, mapRef }: MapCreatorCardProps) => {
  const { user, isLoading: isLoadingUser } = useUser(userId);

  const placeId = useMemo(() => {
    if (!user?.place) return null;
    return typeof user.place === "string" ? user.place : user.place._id;
  }, [user?.place]);

  const {
    place,
    isLoading: isLoadingPlace,
    refetch: refetchPlace,
  } = usePlace(placeId, {
    scheduleWithEvents: true,
  });

  const isLoading = isLoadingUser || isLoadingPlace;

  useEffect(() => {
    if (mapRef.current && place) {
      navigateToPlaceOnMap({
        mapRef,
        placeId: place._id,
        coordinates: place.location?.coordinates || [],
      });
    }
  }, [mapRef, place]);

  const handleMapButtonClick = async (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }): Promise<void> => {
    if (!placeItem.location) return;
    await navigateToPlaceOnMap({
      mapRef,
      placeId: placeItem._id,
      coordinates: placeItem.location.coordinates,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <article className={styles.placeCardMap}>
      <CreatorHeader place={place || null} user={user} isLoading={isLoading} />
      <MapCreatorCardContent
        place={place || null}
        user={user}
        onMapButtonClick={handleMapButtonClick}
        onPlaceRefetch={refetchPlace}
      />
    </article>
  );
};

export default MapCreatorCard;
