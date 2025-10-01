import styles from "./PartnershipsList.module.scss";
import TitleWithLine from "@/components/common/typography/TitleWithLinetempname";
import { PartnershipPopulated } from "@/types/partnerships";
import EmptyState from "../../common/noResults/EmptyStatetempname";
import { Users } from "lucide-react";
import PartnershipCard from "@/components/placeProfile/PartnershipCard";

const PartnershipsList = ({
  partnerships,
  title = "Partenaires",
  noTitle = false,
}: {
  partnerships: PartnershipPopulated[];
  title?: string;
  noTitle?: boolean;
}) => {
  return (
    <section className={styles.partnershipsList}>
      {!noTitle && (
        <TitleWithLine className={styles.partnershipsTitle}>
          {title}
        </TitleWithLine>
      )}
      {partnerships.length > 0 ? (
        <div className={styles.partnershipsGrid}>
          {partnerships.map((partnership) => (
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
