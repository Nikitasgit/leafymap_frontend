import React from "react";
import styles from "./ParticipantsList.module.scss";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import { PartnershipPopulated } from "@/types/partnerships";
import CreatorSmallCard from "@/components/common/users/creatorSmallCard/CreatorSmallCard";
import EmptyState from "../../noResults/emptyState";
import { Users } from "lucide-react";

const ParticipantsList = ({
  partnerships,
  title = "Participants",
  noTitle = false,
}: {
  partnerships: PartnershipPopulated[];
  title?: string;
  noTitle?: boolean;
}) => {
  return (
    <div className={styles.participantsList}>
      {!noTitle && (
        <TitleWithLine as="h3" className={styles.participantsTitle}>
          {title}
        </TitleWithLine>
      )}
      {partnerships.length > 0 ? (
        <div className={styles.participantsGrid}>
          {partnerships.map((partnership) => (
            <CreatorSmallCard
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
    </div>
  );
};

export default ParticipantsList;
