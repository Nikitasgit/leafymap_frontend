"use client";

import Button from "@/shared/ui/buttons/button";
import type { Partnership } from "@/features/partnerships/types";
import { Collaborator } from "@/features/places/types/collaborators";
import { useTranslation } from "react-i18next";
import styles from "./EventPartnershipsSelect.module.scss";
import EventStatus from "../eventStatus";

const EventPartnershipsSelect = ({
  partnerships,
  selectedPartnerships,
  onClick,
}: {
  partnerships: Partnership[];
  selectedPartnerships: Collaborator[];
  onClick: (partnership: Partnership) => void;
}) => {
  const { t } = useTranslation("events");

  const emptyMessage =
    partnerships.length === 0
      ? t("eventPartnershipsSelect.noParticipantsHint")
      : selectedPartnerships.length === 0
      ? t("eventPartnershipsSelect.noParticipantsOnSlot")
      : t("eventPartnershipsSelect.participantsAdded", {
          count: selectedPartnerships.length,
        });

  return (
    <div className={styles.partnershipsSelectContainer}>
      <h4 className={styles.title}>{t("eventPartnershipsSelect.title")}</h4>
      <ul className={styles.partnershipsSelect}>
        {partnerships.map((partnership) => {
          const username =
            partnership.collaborator.username ??
            t("eventPartnershipsSelect.defaultUser");
          return (
            <li key={partnership.id}>
              <Button
                className={styles.partnershipButton}
                variant={
                  selectedPartnerships.some(
                    (p) => p.id === partnership.collaborator.id
                  )
                    ? "outline"
                    : "secondary"
                }
                onClick={() => onClick(partnership)}
                ariaLabel={t("eventPartnershipsSelect.addParticipantAriaLabel", {
                  username,
                })}
              >
                {username}{" "}
                <EventStatus
                  status={partnership.status}
                />
              </Button>
            </li>
          );
        })}
      </ul>
      <p className={styles.emptyMessage}>{emptyMessage}</p>
    </div>
  );
};

export default EventPartnershipsSelect;
