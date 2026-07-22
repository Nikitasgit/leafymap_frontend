"use client";

import { EventTimeSlot } from "@/features/places/types/schedule";
import styles from "./EventSlotCard.module.scss";
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventSlotCard = ({
  slot,
  setTimeSlotToEdit,
  onDeleteTimeSlot,
}: {
  slot: EventTimeSlot;
  setTimeSlotToEdit: (slot: EventTimeSlot) => void;
  onDeleteTimeSlot: (slotId: string) => void;
}) => {
  const { t } = useTranslation("events");

  return (
    <div className={styles.timeSlotItem}>
      <div className={styles.timeSlotInfoContainer}>
        <div className={styles.timeSlotInfo}>
          <p className={styles.timeSlotTitle}>{slot.title}</p>
          <div className={styles.timeSlotTime}>
            <p className={styles.timeRange}>
              {slot.startTime} - {slot.endTime}
            </p>
          </div>
        </div>

        <div className={styles.participantsContainer}>
          <p className={styles.participantsLabel}>
            {t("eventSlotCard.participants")}
          </p>
          <p className={styles.participantsList}>
            {slot.collaborators?.length > 0
              ? slot.collaborators
                  .map((collaborator) => collaborator.name)
                  .join(", ")
              : t("eventSlotCard.noCollaborators")}
          </p>
        </div>
      </div>
      <div className={styles.actionsContainer}>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.editButton}`}
          onClick={() => setTimeSlotToEdit(slot)}
          title={t("eventSlotCard.editSlotTitle")}
        >
          <Edit size={14} />
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.deleteButton}`}
          title={t("eventSlotCard.deleteSlotTitle")}
          onClick={() => onDeleteTimeSlot(slot.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default EventSlotCard;
