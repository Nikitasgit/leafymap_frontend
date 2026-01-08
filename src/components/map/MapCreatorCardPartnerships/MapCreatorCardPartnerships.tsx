import styles from "./MapCreatorCardPartnerships.module.scss";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventCard from "@/components/common/events/EventCard";
import { PlaceCard } from "@/components/userProfile/PlacesSection/PlaceCard";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";

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

            return (
              <EventCard
                key={partnership._id}
                event={event}
                place={placeItem}
              />
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
            const place =
              typeof partnership.place === "object" ? partnership.place : null;

            if (!place) return null;

            return (
              <PlaceCard
                key={partnership._id}
                user={partnership.initiator as UserPopulated}
                place={place}
                actions={[
                  {
                    type: "view",
                    onClick: () => onMapButtonClick(place),
                    ariaLabel: `Voir ${place.name} sur la carte`,
                  },
                ]}
              />
            );
          })}
        </section>
      )}
    </div>
  );
};

export default MapCreatorCardPartnerships;
