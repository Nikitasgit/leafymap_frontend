import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./UserCardMap.module.scss";
import { User, Map, ExternalLink } from "lucide-react";
import { Collaborator } from "@/types/place/collaborators";
import { useFindCreatorInPlaces } from "@/hooks/useFindCreatorInPlaces";
import { MapCoordinates } from "@/types/common";
import { MapRef } from "react-map-gl/mapbox";
import { applyPixelOffsetToLocation } from "@/utils/map";

interface UserCardMapProps {
  user: Collaborator;
  onMapLocationChange?: (location: MapCoordinates) => void;
  mapRef?: React.RefObject<MapRef | null>;
}

const UserCardMap = ({
  user,
  onMapLocationChange,
  mapRef,
}: UserCardMapProps) => {
  const { data: userPlaces, findCreatorInPlaces } = useFindCreatorInPlaces();
  console.log("mapRef", mapRef);
  useEffect(() => {
    findCreatorInPlaces(user._id);
  }, [user._id, findCreatorInPlaces]);

  const handleMapButtonClick = (placeData: {
    place: { location: { coordinates: number[] } };
  }) => {
    if (placeData.place.location?.coordinates && mapRef?.current) {
      const [longitude, latitude] = placeData.place.location.coordinates;

      const offsetLocation = applyPixelOffsetToLocation(
        mapRef,
        { latitude, longitude, zoom: 15 },
        -100,
        0
      );

      onMapLocationChange?.(offsetLocation);

      mapRef.current.flyTo({
        center: [offsetLocation.longitude, offsetLocation.latitude],
        zoom: 15,
        duration: 2000,
      });
    }
  };

  if (!userPlaces) return <div>Loading...</div>;

  return (
    <div className={styles.userCardMap}>
      <div className={styles.creatorProfile}>
        <div className={styles.creatorImageContainer}>
          <Image
            src={userPlaces.user?.image || "/images/default-user.png"}
            alt={userPlaces.user?.creatorProfile?.name || "Creator"}
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
                  {placeData.events.length > 3 && (
                    <Text className={styles.moreEvents}>
                      +{placeData.events.length - 3} more events
                    </Text>
                  )}
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
