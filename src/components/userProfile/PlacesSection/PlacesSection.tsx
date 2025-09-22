import React from "react";
import { MapPin } from "lucide-react";
import Text from "@/components/common/typography/Text";
import PlaceCard from "./PlaceCard/PlaceCard";
import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./PlacesSection.module.scss";

interface PlacesSectionProps {
  placePartnerships: PartnershipPopulated[];
  user: User;
}

const PlacesSection: React.FC<PlacesSectionProps> = ({
  placePartnerships,
  user,
}) => {
  return (
    <section>
      <Text as="h3">Où retrouver {user.creatorName} ?</Text>
      <div className={styles.placesList}>
        {placePartnerships.length > 0 ? (
          <div className={styles.placesGrid}>
            {placePartnerships.map((partnership) => {
              const place = partnership.place;
              return (
                <PlaceCard key={partnership._id} place={place} user={user} />
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MapPin className={styles.icon} />
            <Text as="p" className={styles.text}>
              Aucun lieu associé pour le moment
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlacesSection;
