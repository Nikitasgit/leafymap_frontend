import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./UserCardMap.module.scss";
import { User, Map, ExternalLink } from "lucide-react";
import { ExtendedMapRef } from "@/types/map";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { useRouter } from "next/navigation";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import { useUser } from "@/hooks/useUser";

interface UserCardMapProps {
  userId: string;
  mapRef?: React.RefObject<ExtendedMapRef | null>;
}

const UserCardMap = ({ userId, mapRef }: UserCardMapProps) => {
  const { partnerships, isLoading: isLoadingPartnerships } =
    usePartnershipByUserId(userId, { asCollaborator: "true" });
  const { user, isLoading: isLoadingUser } = useUser(userId);
  const isLoading = isLoadingPartnerships || isLoadingUser;

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

  if (isLoading || !user) return <LoadingBar />;
  return (
    <div className={styles.userCardMap}>
      <div className={styles.creatorProfile}>
        <div
          className={styles.creatorImageContainer}
          onClick={() => router.push(`/users/${user?._id}`)}
        >
          <Image
            src={user?.image.url}
            alt={user.creatorName}
            width={55}
            height={55}
            className={styles.creatorImage}
          />
        </div>
        <div className={styles.creatorInfo}>
          <h2 className={styles.creatorName}>{user.creatorName}</h2>
          <div className={styles.creatorCategories}>
            {user.creatorCategories?.map((category) => (
              <Text key={category._id} className={styles.category}>
                {category.name}
              </Text>
            ))}
          </div>
        </div>
        {user.places && user.places.length > 0 && (
          <Button
            onClick={() =>
              handleMapButtonClick({
                place: user.places[0],
              })
            }
          >
            <Map size={14} />
          </Button>
        )}
      </div>

      <div className={styles.placesSection}>
        <h3 className={styles.placesTitle}>
          Où retrouver {user.creatorName} (
          {partnerships.eventPartnerships.length +
            partnerships.placePartnerships.length}
          )
        </h3>

        {partnerships.placePartnerships.map((partnership) => (
          <div key={partnership._id} className={styles.placeCard}>
            <div className={styles.placeMainSection}>
              <div className={styles.placeImageContainer}>
                <Image
                  src={partnership.place.image.url}
                  alt={partnership.place.name}
                  width={80}
                  height={80}
                  className={styles.placeImage}
                />
              </div>

              <div className={styles.placeContent}>
                <div className={styles.placeHeader}>
                  <h4 className={styles.placeName}>{partnership.place.name}</h4>
                  <div className={styles.placeButtons}>
                    <Button
                      onClick={() =>
                        router.push(`/places/${partnership.place._id}`)
                      }
                    >
                      <User size={14} />
                    </Button>
                    <Button
                      onClick={() => handleMapButtonClick(partnership.place)}
                    >
                      <Map size={14} />
                    </Button>
                  </div>
                </div>

                <Text className={styles.locationText}>
                  {partnership.place.location?.label}
                </Text>
              </div>
            </div>

            {partnership.events && partnership.events.length > 0 && (
              <div className={styles.eventsSection}>
                <Text className={styles.eventsTitle}>
                  Events ({partnership.events.length})
                </Text>
                <div className={styles.eventsList}>
                  {partnership.events.slice(0, 3).map((event) => (
                    <div key={event._id} className={styles.eventItem}>
                      <div className={styles.eventImageContainer}>
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={32}
                          height={32}
                          className={styles.eventImage}
                        />
                      </div>
                      <Text className={styles.eventName}>{event.title}</Text>
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
