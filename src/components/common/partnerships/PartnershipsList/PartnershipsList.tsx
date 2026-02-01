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
          {filteredPartnerships.map((partnership) => {
            const collaborator = partnership.collaborator;
            const user = {
              _id: collaborator?._id ?? partnership._id,
              name:
                (collaborator as { username?: string })?.username ||
                (collaborator as { name?: string })?.name ||
                "Utilisateur",
              image:
                typeof collaborator?.image === "string"
                  ? collaborator.image
                  : (
                      collaborator as {
                        image?: { urls?: { thumbnail?: string } };
                      }
                    )?.image?.urls?.thumbnail ?? "",
              category:
                (collaborator as { userCategories?: { name: string }[] })
                  ?.userCategories?.[0]?.name ?? "",
            };
            return (
              <PartnershipCard
                key={partnership._id}
                user={user}
                showCategory={true}
              />
            );
          })}
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
