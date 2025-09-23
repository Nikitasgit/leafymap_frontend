import Text from "@/components/common/typography/Text";
import ParticipantsList from "@/components/common/users/participantsList";
import { PartnershipPopulated } from "@/types/partnerships";
import { Users } from "lucide-react";
import React from "react";
import styles from "./PartnershipsSection.module.scss";

const PartnershipsSection = ({
  partnerships,
}: {
  partnerships: PartnershipPopulated[];
}) => {
  return (
    <section className={styles.partnershipsList}>
      <Text as="h3">Créateurs partenaires</Text>
      {partnerships.length > 0 ? (
        <ParticipantsList partnerships={partnerships} noTitle />
      ) : (
        <div className={styles.emptyState}>
          <Users className={styles.icon} />
          <Text as="p" className={styles.text}>
            Aucun créateur partenaire pour le moment
          </Text>
        </div>
      )}
    </section>
  );
};

export default PartnershipsSection;
