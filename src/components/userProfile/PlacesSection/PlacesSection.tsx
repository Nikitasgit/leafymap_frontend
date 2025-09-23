import React from "react";
import { MapPin } from "lucide-react";
import Text from "@/components/common/typography/Text";
import PlaceCard from "./PlaceCard/PlaceCard";
import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./PlacesSection.module.scss";
import EmptyState from "@/components/common/noResults/emptyState";

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
              return <PlaceCard key={partnership._id} place={place} />;
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

export default PlacesSection;
