import Image from "next/image";
import Button from "@/components/common/buttons/Button";
import styles from "./MapCreatorCard.module.scss";
import { Map, SquareArrowOutUpRight } from "lucide-react";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { useRouter } from "next/navigation";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import { useUser } from "@/hooks/useUser";
import { Calendar } from "lucide-react";
import { getEventDisplayInfo } from "@/utils/eventDates";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadgetempname";
import { MapCreatorCardProps } from "./MapCreatorCard.types";

const MapCreatorCard = ({ userId, mapRef }: MapCreatorCardProps) => {
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
    <article className={styles.userCardMap}>
      <header className={styles.creatorProfile}>
        <button
          className={styles.creatorInfo}
          onClick={() => router.push(`/users/${user?._id}`)}
          type="button"
          aria-label={`Voir le profil de ${user.creatorName}`}
        >
          <Image
            src={
              user.image?.urls?.thumbnail || "https://i.pravatar.cc/40?img=3"
            }
            alt={user.creatorName || "Créateur"}
            width={55}
            height={55}
            className={styles.creatorImage}
          />
          <div className={styles.creatorText}>
            <h2>{user.creatorName}</h2>
            <CreatorCategoryBadge
              categoryName={user.creatorCategories[0].name}
            />
          </div>
        </button>
        <Button
          variant="simple"
          onClick={() =>
            handleMapButtonClick({
              location: user.places![0].location,
              _id: user.places![0]._id,
            })
          }
          type="button"
          ariaLabel="Voir sur la carte"
        >
          <Map size={12} />
        </Button>
      </header>

      <div className={styles.placesAndEventsSection}>
        {eventPartnerships && eventPartnerships.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Evenements en cours et à venir ({eventPartnerships.length}):
            </h3>
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
                          event.image.urls.thumbnail ||
                          "https://i.pravatar.cc/40?img=3"
                        }
                        alt={event.name}
                        width={54}
                        height={54}
                      />
                    </div>
                    <div className={styles.cardText}>
                      <h5>{event.name}</h5>
                      <div className={styles.scheduleItem}>
                        <Calendar size={12} />
                        <p className={styles.scheduleText}>
                          {eventDisplayInfo.formattedDateRange}
                        </p>
                      </div>

                      <p className={styles.description}>{event.description}</p>
                      <Button
                        className={styles.eventLocationButton}
                        variant="simple"
                        startIcon={<SquareArrowOutUpRight size={12} />}
                        onClick={() => router.push(`/places/${place._id}`)}
                        type="button"
                        ariaLabel={`Voir le lieu ${place.name}`}
                      >
                        {place.name}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="simple"
                    className={styles.eventButton}
                    onClick={() => router.push(`/events/${event._id}`)}
                    type="button"
                    ariaLabel={`Voir l'événement ${event.name}`}
                  >
                    <SquareArrowOutUpRight size={12} />
                  </Button>
                </div>
              );
            })}
          </section>
        )}
        <section className={styles.section} aria-labelledby="places-title">
          <h3 id="places-title" className={styles.sectionTitle}>
            Lieux partenaires ({placePartnerships.length})
          </h3>

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
                        place.image.urls.thumbnail ||
                        "https://i.pravatar.cc/40?img=3"
                      }
                      alt={place.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className={styles.cardText}>
                    <h5>{place.name}</h5>
                    <p className={styles.locationText}>
                      {place.location?.label}
                    </p>
                  </div>
                </div>
                <Button
                  variant="simple"
                  className={styles.mapButton}
                  onClick={() => handleMapButtonClick(place)}
                  type="button"
                  ariaLabel={`Voir ${place.name} sur la carte`}
                >
                  <Map size={12} />
                </Button>
              </div>
            );
          })}
        </section>
      </div>
    </article>
  );
};
export default MapCreatorCard;
