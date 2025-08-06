import React, { useState } from "react";
import TimeSlotInputs from "./timeSlotInputs/TimeSlotInputs";
import SearchInput from "../inputs/searchInput/SearchInput";
import { Collaborator } from "@/types/place/collaborators";
import TextField from "../inputs/textField/TextField";
import Button from "../buttons/button/Button";
import { EventTimeSlot } from "@/types/place/schedule";
import styles from "./NewSlot.module.scss";
import { useFindCreators } from "@/hooks/useFindCreators";
import { useToast } from "@/hooks/useToast";
import { generateTempId } from "@/utils/tempId";

interface NewSlotProps {
  collaborators: Collaborator[];
  onSubmit: (timeSlot: EventTimeSlot) => void;
  defaultSlot?: EventTimeSlot;
  onCancel?: () => void;
}

const NewSlot: React.FC<NewSlotProps> = ({
  collaborators,
  onSubmit,
  defaultSlot,
  onCancel,
}) => {
  const { showError } = useToast();
  const { searchCreators } = useFindCreators();
  const [timeSlot, setTimeSlot] = useState<EventTimeSlot>(
    defaultSlot || {
      title: "",
      startTime: "",
      endTime: "",
      collaborators: [],
      createdCollaborators: [],
      _id: generateTempId(),
    }
  );

  const handleParticipantSelect = (collaborator: Collaborator) => {
    if (!timeSlot.collaborators.some((p) => p._id === collaborator._id)) {
      setTimeSlot({
        ...timeSlot,
        collaborators: [...timeSlot.collaborators, collaborator],
      });
    }
  };
  const handleParticipantDelete = (id: string) => {
    setTimeSlot({
      ...timeSlot,
      collaborators: timeSlot.collaborators.filter((p) => p._id !== id),
    });
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
      createdCollaborators: [],
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
      <SearchInput
        label="Participants"
        onSelect={handleParticipantSelect}
        onDelete={handleParticipantDelete}
        initialSuggestions={collaborators}
        fetchSuggestions={searchCreators}
        list={timeSlot.collaborators}
        withIcons
        displayList
      />
      <div className={styles.buttonContainer}>
        <Button variant="secondary" onClick={handleCancelTimeSlot} fullWidth>
          Annuler
        </Button>
        <Button onClick={handleValidateTimeSlot} fullWidth>
          {defaultSlot ? "Modifier ce créneau" : "Ajouter ce créneau"}
        </Button>
      </div>
    </div>
  );
};

export default NewSlot;
