import { useEffect } from "react";
import styles from "./MapCreatorCard.module.scss";
import { usePlace } from "@/hooks/usePlace";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import MapCreatorCardHeader from "../MapCreatorCardHeader";
import MapCreatorCardContent from "../MapCreatorCardContent";

const MapCreatorCard = ({ placeId, mapRef }: MapCreatorCardProps) => {
  const { place, isLoading } = usePlace(placeId, { scheduleWithEvents: true });
  const user = place?.user;
  const { partnerships } = usePartnershipByUserId(user?._id, {
    asCollaborator: "true",
  });
  const placePartnerships = partnerships.filter(
    (partnership) => partnership.type === "place"
  );
  const eventPartnerships = partnerships.filter(
    (partnership) => partnership.type === "event"
  );

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

  return (
    <article className={styles.placeCardMap}>
      <MapCreatorCardHeader place={place} user={user} isLoading={isLoading} />
      <MapCreatorCardContent
        place={place}
        placeUser={user || null}
        eventPartnerships={eventPartnerships}
        placePartnerships={placePartnerships}
        onMapButtonClick={handleMapButtonClick}
      />
    </article>
  );
};

export default MapCreatorCard;
