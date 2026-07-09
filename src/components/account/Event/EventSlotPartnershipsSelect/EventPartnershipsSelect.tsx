"use client";

import Button from "@/components/common/buttons/Button";
import { Partnership } from "@/types/partnerships";
import { Collaborator } from "@/types/place/collaborators";
import { useTranslation } from "react-i18next";
import styles from "./EventPartnershipsSelect.module.scss";
import EventStatus from "@/components/common/events/EventStatus";

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
            <li key={partnership._id}>
              <Button
                className={styles.partnershipButton}
                variant={
                  selectedPartnerships.some(
                    (p) => p._id === partnership.collaborator._id
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
