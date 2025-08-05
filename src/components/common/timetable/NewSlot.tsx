import React, { useState } from "react";
import TimeSlotInputs from "./timeSlotInputs/TimeSlotInputs";
import SearchInput from "../inputs/searchInput/SearchInput";
import { Period } from "@/types/place/schedule";
import { Collaborator } from "@/types/place/collaborators";
import TextField from "../inputs/textField/TextField";
import Button from "../buttons/button/Button";
import { EventTimeSlot } from "@/types/place/schedule";
import styles from "./NewSlot.module.scss";

interface NewSlotProps {
  collaborators: Collaborator[];
  period: Period;
  onSubmit: (timeSlot: EventTimeSlot) => void;
  defaultSlot?: EventTimeSlot;
}

const NewSlot: React.FC<NewSlotProps> = ({
  collaborators,
  onSubmit,
  defaultSlot,
}) => {
  const [timeSlot, setTimeSlot] = useState<EventTimeSlot>(
    defaultSlot || {
      title: "",
      startTime: "",
      endTime: "",
      participants: [],
      _id: `new-slot-${Date.now()}`,
    }
  );
  const handleParticipantSelect = (collaborator: Collaborator) => {
    if (!timeSlot.participants.some((p) => p._id === collaborator._id)) {
      setTimeSlot({
        ...timeSlot,
        participants: [...timeSlot.participants, collaborator],
      });
    }
  };
  const handleParticipantDelete = (id: string) => {
    setTimeSlot({
      ...timeSlot,
      participants: timeSlot.participants.filter((p) => p._id !== id),
    });
  };
  const handleValidateTimeSlot = () => {
    if (!timeSlot.title || !timeSlot.startTime || !timeSlot.endTime) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    onSubmit(timeSlot);
  };
  const handleCancelTimeSlot = () => {
    if (defaultSlot) {
      setTimeSlot(defaultSlot);
      return;
    }
    setTimeSlot({
      title: "",
      startTime: "",
      endTime: "",
      participants: [],
      _id: `new-slot-${Date.now()}`,
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
        updatedValue = value.toLocaleTimeString("fr-FR", { hour12: false });
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
        fetchSuggestions={async (input: string) => {
          return collaborators.filter((collab) =>
            collab.name?.toLowerCase().includes(input.toLowerCase())
          );
        }}
        list={timeSlot.participants}
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
