import { useState } from "react";
import TimeSlotInputs from "@/components/common/inputs/TimeSlotInputs";
import TextField from "@/components/common/inputs/textField/TextField";
import Button from "@/components/common/buttons/button/Button";
import { EventTimeSlot } from "@/types/place/schedule";
import styles from "./EventEditTimeSlot.module.scss";
import { useToast } from "@/hooks/useToast";
import { generateTempId } from "@/utils/tempId";
import { Partnership } from "@/types/partnerships";
import PartnershipsSelect from "@/components/account/formComponents/Event/EventSlotPartnershipsSelect";

interface EventEditTimeSlotProps {
  partnerships: Partnership[];
  onSubmit: (timeSlot: EventTimeSlot) => void;
  defaultSlot?: EventTimeSlot;
  onCancel?: () => void;
}

const EventEditTimeSlot: React.FC<EventEditTimeSlotProps> = ({
  partnerships,
  onSubmit,
  defaultSlot,
  onCancel,
}) => {
  const { showError } = useToast();
  const [timeSlot, setTimeSlot] = useState<EventTimeSlot>(
    defaultSlot || {
      title: "",
      startTime: "",
      endTime: "",
      collaborators: [],
      _id: generateTempId(),
    }
  );

  const handleParticipantSelect = (partnership: Partnership) => {
    if (
      !timeSlot.collaborators?.some(
        (p) => p._id === partnership.collaborator._id
      )
    ) {
      setTimeSlot({
        ...timeSlot,
        collaborators: [...timeSlot.collaborators, partnership.collaborator],
      });
    } else {
      setTimeSlot({
        ...timeSlot,
        collaborators: timeSlot.collaborators.filter(
          (p) => p._id !== partnership.collaborator._id
        ),
      });
    }
  };

  const handleValidateTimeSlot = () => {
    if (!timeSlot.title || !timeSlot.startTime || !timeSlot.endTime) {
      showError("Veuillez remplir tous les champs obligatoires du créneau.");
      if (timeSlot.title.length < 3) {
        showError("Le titre du créneau doit contenir au moins 3 caractères.");
      }
      return;
    }
    onSubmit(timeSlot);
  };
  const handleCancelTimeSlot = () => {
    if (onCancel) {
      onCancel();
    }
    setTimeSlot({
      title: "",
      startTime: "",
      endTime: "",
      collaborators: [],
      _id: generateTempId(),
    });
  };
  const handleSlotChange = (
    field: keyof EventTimeSlot,
    value: Date | string | null
  ) => {
    let updatedValue: string;
    if (field === "title") {
      updatedValue = value as string;
    } else {
      if (value instanceof Date) {
        updatedValue = value.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } else {
        updatedValue = value as string;
      }
    }

    const updatedSlot = { ...timeSlot, [field]: updatedValue };

    if (
      updatedSlot.startTime &&
      updatedSlot.endTime &&
      updatedSlot.endTime < updatedSlot.startTime
    ) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    setTimeSlot(updatedSlot);
  };

  return (
    <div className={styles.newSlotContainer}>
      <TimeSlotInputs
        getExcludedTimes={() => []}
        onTimeChange={handleSlotChange}
        onRemove={() => {}}
        canRemove={false}
        slot={timeSlot}
      />
      <TextField
        className={styles.titleInput}
        label="Titre du créneau"
        required
        fullWidth
        name="title"
        value={timeSlot.title || ""}
        onChange={(e) => handleSlotChange("title", e.target.value)}
      />
      <PartnershipsSelect
        partnerships={partnerships}
        selectedPartnerships={timeSlot.collaborators}
        onClick={handleParticipantSelect}
      />
      <div className={styles.buttonContainer}>
        <Button variant="secondary" onClick={handleCancelTimeSlot} fullWidth ariaLabel="Annuler le créneau">
          Annuler
        </Button>
        <Button onClick={handleValidateTimeSlot} fullWidth ariaLabel="Valider le créneau">
          {defaultSlot ? "Modifier ce créneau" : "Ajouter ce créneau"}
        </Button>
      </div>
    </div>
  );
};

export default EventEditTimeSlot;
