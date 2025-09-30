import { EventTimeSlot } from "@/types/place/schedule";
import styles from "./EventSlotCard.module.scss";
import React from "react";
import { Edit, Trash2 } from "lucide-react";

const EventSlotCard = ({
  slot,
  setTimeSlotToEdit,
  onDeleteTimeSlot,
}: {
  slot: EventTimeSlot;
  setTimeSlotToEdit: (slot: EventTimeSlot) => void;
  onDeleteTimeSlot: (slotId: string) => void;
}) => {
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
          <p className={styles.participantsLabel}>Participants</p>
          <p className={styles.participantsList}>
            {slot.collaborators?.length > 0
              ? slot.collaborators
                  .map((collaborator) => collaborator.name)
                  .join(", ")
              : "Aucun collaborateur ajouté"}
          </p>
        </div>
      </div>
      <div className={styles.actionsContainer}>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.editButton}`}
          onClick={() => setTimeSlotToEdit(slot)}
          title="Modifier le créneau"
        >
          <Edit size={14} />
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.deleteButton}`}
          title="Supprimer le créneau"
          onClick={() => onDeleteTimeSlot(slot._id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default EventSlotCard;
