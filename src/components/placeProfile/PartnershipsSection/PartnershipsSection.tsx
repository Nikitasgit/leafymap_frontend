import { PartnershipPopulated } from "@/types/partnerships";
import React from "react";
import styles from "./PartnershipsSection.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";
import PlacePartnershipsList from "../PartnershipsList";

const PartnershipsSection = ({
  partnerships,
}: {
  partnerships: PartnershipPopulated[];
}) => {
  return (
    <section className={styles.partnershipsSection}>
      <h3>Créateurs partenaires</h3>
      {partnerships.length > 0 ? (
        <PlacePartnershipsList partnerships={partnerships} noTitle />
      ) : (
        <EmptyState title="Aucun créateur partenaire pour le moment" />
      )}
    </section>
  );
};

export default PartnershipsSection;
