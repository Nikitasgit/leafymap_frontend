import Button from "@/components/common/buttons/button/Button";
import { Partnership } from "@/types/partnerships";
import { Collaborator } from "@/types/place/collaborators";
import React from "react";
import styles from "./PartnershipsSelect.module.scss";
import { useTranslation } from "react-i18next";
import Text from "@/components/common/typography/Text";

const PartnershipsSelect = ({
  partnerships,
  selectedPartnerships,
  onClick,
}: {
  partnerships: Partnership[];
  selectedPartnerships: Collaborator[];
  onClick: (partnership: Partnership) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.partnershipsSelectContainer}>
      <Text as="h4" className={styles.title}>
        Participants sur ce créneau:
      </Text>
      <ul className={styles.partnershipsSelect}>
        {partnerships.map((partnership) => (
          <li key={partnership._id}>
            <Button
              variant={
                selectedPartnerships.some(
                  (p) => p._id === partnership.collaborator._id
                )
                  ? "outline"
                  : "secondary"
              }
              onClick={() => onClick(partnership)}
            >
              {partnership.collaborator.name}{" "}
              <span className={styles.partnershipStatus}>
                {t(`partnershipStatus.${partnership.status}`)}
              </span>
            </Button>
          </li>
        ))}
      </ul>
      <p className={styles.emptyMessage}>
        {partnerships.length === 0
          ? "Pour ajouter des participants à ce créneau, vous devez d'abord les ajouter à la liste des participants de l'évènement."
          : selectedPartnerships.length === 0
          ? "Aucun participant n'a été ajouté à ce créneau."
          : `${selectedPartnerships.length} participant${
              selectedPartnerships.length > 1 ? "s" : ""
            } ajouté${
              selectedPartnerships.length > 1 ? "s" : ""
            } à ce créneau.`}
      </p>
    </div>
  );
};

export default PartnershipsSelect;
