import styles from "./PartnershipsList.module.scss";
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
  title = "Participants",
  noTitle = false,
}: PartnershipsListProps) => {
  const filteredPartnerships = partnerships.filter(
    (partnership) => !partnership.deleted && partnership.status === "accepted"
  );

  return (
    <section className={styles.partnershipsList}>
      {!noTitle && <h3 className={styles.sectionTitle}>{title}</h3>}
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
          title="Aucun participant pour le moment"
          icon={<Users className={styles.icon} />}
        />
      )}
    </section>
  );
};

export default PartnershipsList;
