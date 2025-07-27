import React from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./UserCardMap.module.scss";
import { User, Map, ExternalLink } from "lucide-react";
import { useFindCreatorInPlaces } from "@/hooks/useFindCreatorInPlaces";
import { ExtendedMapRef } from "@/types/map";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { useRouter } from "next/navigation";
import LoadingBar from "@/components/common/loading/LoadingBar";

interface UserCardMapProps {
  userId: string;
  mapRef?: React.RefObject<ExtendedMapRef | null>;
}

const UserCardMap = ({ userId, mapRef }: UserCardMapProps) => {
  const { data: userPlaces, isLoading } = useFindCreatorInPlaces(userId);
  const router = useRouter();

  const handleMapButtonClick = async (placeData: {
    place: { location: { coordinates: number[] }; _id: string };
  }) => {
    await navigateToPlaceOnMap({
      mapRef,
      placeId: placeData.place._id,
      coordinates: placeData.place.location.coordinates,
    });
  };

  if (isLoading || !userPlaces) return <LoadingBar />;
  return (
    <div className={styles.userCardMap}>
      <div className={styles.creatorProfile}>
        <div
          className={styles.creatorImageContainer}
          onClick={() => router.push(`/users/${userPlaces.user?._id}`)}
        >
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
                    <Button
                      onClick={() =>
                        router.push(`/places/${placeData.place._id}`)
                      }
                    >
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
