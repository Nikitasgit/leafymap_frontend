import React from "react";
import { MapPin } from "lucide-react";
import { CreatorCard } from "../CreatorCard";
import styles from "./PlacesSectionContainer.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";
import { PlacesSectionProps } from "./PlacesSectionContainer.types";

const PlacesSectionContainer: React.FC<PlacesSectionProps> = ({
  placePartnerships,
  user,
}) => {
  return (
    <section className={styles.placesSection}>
      <h3>Où retrouver {user.username} ?</h3>
      <div className={styles.placesList}>
        {placePartnerships.length > 0 ? (
          <div className={styles.placesGrid}>
            {placePartnerships.map((partnership) => {
              const place = partnership.place;
              return (
                <CreatorCard
                  key={partnership._id}
                  user={place.user}
                  place={place}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Aucun lieu associé pour le moment"
            icon={<MapPin className={styles.icon} />}
          />
        )}
      </div>
    </section>
  );
};

export default PlacesSectionContainer;
