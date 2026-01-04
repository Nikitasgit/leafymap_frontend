import Image from "next/image";
import Button from "@/components/common/buttons/Button";
import styles from "./MapCreatorCardPartnerships.module.scss";
import { Map, SquareArrowOutUpRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { capitalizeFirstLetter } from "@/utils/functions";
import placeDefaultSvg from "@public/images/place_default.svg";
import { getEventDisplayInfo } from "@/utils/eventDates";
import eventDefaultsSvg from "@public/images/event_default.svg";
import { PartnershipPopulated } from "@/types/partnerships";

export interface MapCreatorCardPartnershipsProps {
  eventPartnerships: PartnershipPopulated[];
  placePartnerships: PartnershipPopulated[];
  username: string;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
}

const MapCreatorCardPartnerships = ({
  eventPartnerships,
  placePartnerships,
  username,
  onMapButtonClick,
}: MapCreatorCardPartnershipsProps) => {
  const router = useRouter();

  if (eventPartnerships.length === 0 && placePartnerships.length === 0) {
    return null;
  }

  return (
    <div className={styles.placesAndEventsSection}>
      {eventPartnerships.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <b> {capitalizeFirstLetter(username)} </b> participe à ces
            événements ({eventPartnerships.length}):
          </h3>
          {eventPartnerships.map((partnership) => {
            const event =
              typeof partnership.event === "object" ? partnership.event : null;
            const placeItem =
              typeof partnership.place === "object" ? partnership.place : null;

            if (!event || !placeItem) return null;

            const eventDisplayInfo = getEventDisplayInfo(event.schedule);
            return (
              <div key={partnership._id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <div
                    className={styles.imageContainer}
                    onClick={() => router.push(`/events/${event._id}`)}
                  >
                    <Image
                      src={event.image?.urls?.thumbnail || eventDefaultsSvg}
                      alt={event.name}
                      fill
                      sizes="54px"
                      style={{ objectFit: "cover" }}
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
                    {(() => {
                      const placeUser =
                        placeItem && typeof placeItem.user === "object"
                          ? placeItem.user
                          : null;
                      return placeUser ? (
                        <Button
                          className={styles.eventLocationButton}
                          variant="simple"
                          startIcon={<SquareArrowOutUpRight size={12} />}
                          onClick={() => router.push(`/users/${placeUser._id}`)}
                          type="button"
                          ariaLabel={`Voir le profil de ${placeUser.username}`}
                        >
                          {placeUser.username}
                        </Button>
                      ) : null;
                    })()}
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
      {placePartnerships.length > 0 && (
        <section className={styles.section} aria-labelledby="places-title">
          <h3 id="places-title" className={styles.sectionTitle}>
            Retrouvez également <b> {capitalizeFirstLetter(username)} </b>
            ici ({placePartnerships.length}):
          </h3>

          {placePartnerships.map((partnership) => {
            return (
              <div key={partnership._id} className={styles.card}>
                <div className={styles.cardInfo}>
                  <div
                    className={styles.partnershipImageContainer}
                    onClick={() => {
                      if (partnership.initiator) {
                        router.push(`/users/${partnership.initiator._id}`);
                      }
                    }}
                  >
                    <Image
                      src={
                        typeof partnership.initiator?.image === "object"
                          ? partnership.initiator.image?.urls?.thumbnail
                          : placeDefaultSvg
                      }
                      alt={partnership.initiator?.username || "Utilisateur"}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className={styles.cardText}>
                    <h5>{partnership.initiator?.username}</h5>
                    <p className={styles.locationText}>
                      {partnership.place?.location?.label}
                    </p>
                  </div>
                </div>
                <Button
                  variant="simple"
                  className={styles.mapButton}
                  onClick={() => onMapButtonClick(partnership.place)}
                  type="button"
                  ariaLabel={`Voir ${partnership.initiator?.username} sur la carte`}
                >
                  <Map size={12} />
                </Button>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default MapCreatorCardPartnerships;
