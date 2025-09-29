import React from "react";
import styles from "./PlacePartnershipsList.module.scss";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import { PartnershipPopulated } from "@/types/partnerships";
import EmptyState from "../../common/noResults/emptyState";
import { Users } from "lucide-react";
import PlacePartnershipCard from "@/components/placeProfile/PlacePartnershipCard";

const PlacePartnershipsList = ({
  partnerships,
  title = "Partenaires",
  noTitle = false,
}: {
  partnerships: PartnershipPopulated[];
  title?: string;
  noTitle?: boolean;
}) => {
  return (
    <div className={styles.placePartnershipsList}>
      {!noTitle && (
        <TitleWithLine className={styles.placePartnershipsTitle}>
          {title}
        </TitleWithLine>
      )}
      {partnerships.length > 0 ? (
        <div className={styles.placePartnershipsGrid}>
          {partnerships.map((partnership) => (
            <PlacePartnershipCard
              key={partnership._id}
              creator={partnership.collaborator}
              showCategory={true}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun partenaire associé pour le moment"
          icon={<Users className={styles.icon} />}
        />
      )}
    </div>
  );
};

export default PlacePartnershipsList;
