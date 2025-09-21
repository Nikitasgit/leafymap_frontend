import React from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./UserCardMap.module.scss";
import { Map, SquareArrowOutUpRight } from "lucide-react";
import { ExtendedMapRef } from "@/types/map";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { useRouter } from "next/navigation";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import { useUser } from "@/hooks/useUser";
import { Calendar } from "lucide-react";
import { getEventDisplayInfo } from "@/utils/eventDates";
import { useTranslation } from "next-i18next";

interface UserCardMapProps {
  userId: string;
  mapRef?: React.RefObject<ExtendedMapRef | null>;
}

const UserCardMap = ({ userId, mapRef }: UserCardMapProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { user, isLoading: isLoadingUser } = useUser(userId);
  const { partnerships, isLoading: isLoadingPartnerships } =
    usePartnershipByUserId(userId, {
      asCollaborator: "true",
      onlyAccepted: "true",
    });

  const placePartnerships = partnerships.filter(
    (partnership) => partnership.type === "place"
  );
  const eventPartnerships = partnerships.filter(
    (partnership) => partnership.type === "event"
  );
  const isLoading = isLoadingPartnerships || isLoadingUser;
  const handleMapButtonClick = async (place: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => {
    if (!place.location) return;
    await navigateToPlaceOnMap({
      mapRef,
      placeId: place._id,
      coordinates: place.location.coordinates,
    });
  };

  if (isLoading || !user || isLoadingPartnerships) return <LoadingBar />;

  return (
    <div className={styles.userCardMap}>
      <div className={styles.creatorProfile}>
        <div
          className={styles.creatorInfo}
          onClick={() => router.push(`/users/${user?._id}`)}
        >
          <Image
            src={
              user.image?.urls?.thumbnail || "https://i.pravatar.cc/40?img=3"
            }
            onClick={() => router.push(`/users/${user?._id}`)}
            alt={user.creatorName}
            width={55}
            height={55}
            className={styles.creatorImage}
          />
          <div className={styles.creatorText}>
            <Text as="h3">{user.creatorName}</Text>
            <Text as="p" className={styles.creatorCategories}>
              {user.creatorCategories
                ?.map((category: { name: string }) =>
                  t(`creatorCategories.${category.name}`)
                )
                .join(", ")}
            </Text>
          </div>
        </div>
        <Button
          variant="simple"
          onClick={() =>
            handleMapButtonClick({
              location: user.places![0].location,
              _id: user.places![0]._id,
            })
          }
        >
          <Map size={12} />
        </Button>
      </div>

      <div className={styles.placesAndEventsSection}>
        {eventPartnerships && eventPartnerships.length > 0 && (
          <div className={styles.section}>
            <Text className={styles.sectionTitle}>
              Evenements en cours et à venir ({eventPartnerships.length}):
            </Text>
            {eventPartnerships.map((partnership) => {
              const event =
                typeof partnership.event === "object"
                  ? partnership.event
                  : null;
              const place =
                typeof partnership.place === "object"
                  ? partnership.place
                  : null;
              if (!event || !place) return null;

              const eventDisplayInfo = getEventDisplayInfo(event.schedule);
              return (
                <div key={partnership._id} className={styles.card}>
                  <div className={styles.cardInfo}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={
                          typeof event.image === "object" && event.image?.urls
                            ? event.image.urls.thumbnail
                            : "https://i.pravatar.cc/40?img=3"
                        }
                        alt={event.name}
                        width={54}
                        height={54}
                      />
                    </div>
                    <div className={styles.cardText}>
                      <Text as="h5">{event.name}</Text>
                      <div className={styles.scheduleItem}>
                        <Calendar size={12} />
                        <Text as="p" className={styles.scheduleText}>
                          {eventDisplayInfo.formattedDateRange}
                        </Text>
                      </div>

                      <Text className={styles.description}>
                        {event.description}
                      </Text>
                      <Button
                        className={styles.eventLocationButton}
                        variant="simple"
                        startIcon={<SquareArrowOutUpRight size={12} />}
                        onClick={() => router.push(`/places/${place._id}`)}
                      >
                        {place.name}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="simple"
                    className={styles.eventButton}
                    onClick={() =>
                      router.push(`places/${place._id}/events/${event._id}`)
                    }
                  >
                    <SquareArrowOutUpRight size={12} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>
            Lieux partenaires ({placePartnerships.length})
          </Text>

          {placePartnerships.map((partnership) => {
            const place =
              typeof partnership.place === "object" ? partnership.place : null;
            if (!place) return null;
            return (
              <div key={partnership._id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <div
                    className={styles.imageContainer}
                    onClick={() => router.push(`/places/${place._id}`)}
                  >
                    <Image
                      src={
                        typeof place.image === "object" && place.image?.urls
                          ? place.image.urls.thumbnail
                          : "/images/default-place.png"
                      }
                      alt={place.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className={styles.cardText}>
                    <Text as="h5">{place.name}</Text>
                    <Text as="p" className={styles.locationText}>
                      {place.location?.label}
                    </Text>
                  </div>
                </div>
                <Button
                  variant="simple"
                  className={styles.mapButton}
                  onClick={() => handleMapButtonClick(place)}
                >
                  <Map size={12} />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default UserCardMap;
