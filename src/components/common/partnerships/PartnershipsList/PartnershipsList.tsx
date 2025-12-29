import styles from "./PartnershipsList.module.scss";
import TitleWithLine from "@/components/common/typography/TitleWithLine";
import { PartnershipPopulated } from "@/types/partnerships";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Users } from "lucide-react";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";

interface PartnershipsListProps {
  partnerships: PartnershipPopulated[];
  title?: string;
  noTitle?: boolean;
}

const PartnershipsList = ({
  partnerships,
  title = "Partenaires",
  noTitle = false,
}: PartnershipsListProps) => {
  const filteredPartnerships = partnerships.filter(
    (partnership) => !partnership.deleted && partnership.status === "accepted"
  );

  return (
    <section className={styles.partnershipsList}>
      {!noTitle && (
        <TitleWithLine className={styles.partnershipsTitle}>
          {title}
        </TitleWithLine>
      )}
      {filteredPartnerships.length > 0 ? (
        <div className={styles.partnershipsGrid}>
          {filteredPartnerships.map((partnership) => (
            <PartnershipCard
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
    </section>
  );
};

export default PartnershipsList;

