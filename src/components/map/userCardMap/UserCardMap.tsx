import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./UserCardMap.module.scss";
import { User, Map, ExternalLink } from "lucide-react";
import { Collaborator } from "@/types/place/collaborators";
import { useFindCreatorInPlaces } from "@/hooks/useFindCreatorInPlaces";
import { MapRef } from "react-map-gl/mapbox";
import { applyPixelOffsetToLocation } from "@/utils/map";
import mapboxgl from "mapbox-gl";

interface UserCardMapProps {
  user: Collaborator;
  mapRef?: React.RefObject<MapRef | null>;
}

const UserCardMap = ({ user, mapRef }: UserCardMapProps) => {
  const { data: userPlaces, findCreatorInPlaces } = useFindCreatorInPlaces();

  useEffect(() => {
    findCreatorInPlaces(user._id);
  }, [user._id, findCreatorInPlaces]);

  const handleMapButtonClick = async (placeData: {
    place: { location: { coordinates: number[] }; _id: string };
  }) => {
    const [longitude, latitude] = placeData.place.location.coordinates;
    const offsetLocation = applyPixelOffsetToLocation(
      { latitude, longitude },
      -100,
      0
    );

    if (mapRef?.current) {
      const mapInstance = mapRef.current as MapRef & {
        setSelectedPlaceId?: (placeId: string | null) => void;
        fetchPlacesInView?: (
          bounds: mapboxgl.LngLatBounds | null
        ) => Promise<void>;
      };
      if (mapInstance.setSelectedPlaceId) {
        mapInstance.setSelectedPlaceId(placeData.place._id);
      }

      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([
        offsetLocation.longitude - 0.01,
        offsetLocation.latitude - 0.01,
      ]);
      bounds.extend([
        offsetLocation.longitude + 0.01,
        offsetLocation.latitude + 0.01,
      ]);

      if (mapInstance.fetchPlacesInView) {
        await mapInstance.fetchPlacesInView(bounds);
      }

      mapRef.current.flyTo({
        center: [offsetLocation.longitude, offsetLocation.latitude],
        zoom: 15,
        duration: 800,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (mapRef?.current) {
        const mapInstance = mapRef.current as MapRef & {
          setSelectedPlaceId?: (placeId: string | null) => void;
        };
        if (mapInstance.setSelectedPlaceId) {
          mapInstance.setSelectedPlaceId(null);
        }
      }
    };
  }, [user._id, mapRef]);

  if (!userPlaces) return <div>Loading...</div>;

  return (
    <div className={styles.userCardMap}>
      <div className={styles.creatorProfile}>
        <div className={styles.creatorImageContainer}>
          <Image
            src={userPlaces.user?.image}
            alt={userPlaces.user?.creatorProfile?.name}
            width={55}
            height={55}
            className={styles.creatorImage}
          />
        </div>
        <div className={styles.creatorInfo}>
          <h2 className={styles.creatorName}>
            {userPlaces.user?.creatorProfile?.name}
          </h2>
          <div className={styles.creatorCategories}>
            {userPlaces.user?.creatorProfile?.categories?.map((category) => (
              <Text key={category._id} className={styles.category}>
                {category.name}
              </Text>
            ))}
          </div>
        </div>
        <Button
          onClick={() =>
            handleMapButtonClick({
              place: userPlaces.user.creatorProfile?.place,
            })
          }
        >
          <Map size={14} />
        </Button>
      </div>

      <div className={styles.placesSection}>
        <h3 className={styles.placesTitle}>
          Où retrouver {userPlaces.user?.creatorProfile?.name} (
          {userPlaces.places?.length || 0})
        </h3>

        {userPlaces.places?.map((placeData) => (
          <div key={placeData.place._id} className={styles.placeCard}>
            <div className={styles.placeMainSection}>
              <div className={styles.placeImageContainer}>
                <Image
                  src={placeData.place.image}
                  alt={placeData.place.name}
                  width={80}
                  height={80}
                  className={styles.placeImage}
                />
              </div>

              <div className={styles.placeContent}>
                <div className={styles.placeHeader}>
                  <h4 className={styles.placeName}>{placeData.place.name}</h4>
                  <div className={styles.placeButtons}>
                    <Button>
                      <User size={14} />
                    </Button>
                    <Button onClick={() => handleMapButtonClick(placeData)}>
                      <Map size={14} />
                    </Button>
                  </div>
                </div>

                <Text className={styles.locationText}>
                  {placeData.place.location.label}
                </Text>
              </div>
            </div>

            {placeData.events && placeData.events.length > 0 && (
              <div className={styles.eventsSection}>
                <Text className={styles.eventsTitle}>
                  Events ({placeData.events.length})
                </Text>
                <div className={styles.eventsList}>
                  {placeData.events.slice(0, 3).map((event) => (
                    <div key={event._id} className={styles.eventItem}>
                      <div className={styles.eventImageContainer}>
                        <Image
                          src={event.image}
                          alt={event.name}
                          width={32}
                          height={32}
                          className={styles.eventImage}
                        />
                      </div>
                      <Text className={styles.eventName}>{event.name}</Text>
                      <Button className={styles.eventButton}>
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default UserCardMap;
