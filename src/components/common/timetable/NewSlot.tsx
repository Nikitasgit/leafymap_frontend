import React, { useState } from "react";
import TimeSlotInputs from "./timeSlotInputs/TimeSlotInputs";
import SearchInput from "../inputs/searchInput/SearchInput";
import { Period } from "@/components/events/form/EventForm";
import { Collaborator } from "@/types/place/collaborators";
import TextField from "../inputs/textField/TextField";
import Button from "../buttons/button/Button";
import { EventTimeSlot } from "./TimeTable.types";

interface NewSlotProps {
  collaborators: Collaborator[];
  period: Period;
  onChange: (timeSlot: EventTimeSlot) => void;
}

const NewSlot: React.FC<NewSlotProps> = ({ collaborators, onChange }) => {
  const [open, setOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState<EventTimeSlot>({
    title: "",
    startTime: "",
    endTime: "",
    participants: [],
    _id: `new-slot-${Date.now()}`,
  });

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
      participants: timeSlot.participants.filter((p) => p.id !== id),
    });
  };
  const handleValidateTimeSlot = () => {
    if (!timeSlot.title || !timeSlot.startTime || !timeSlot.endTime) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    onChange(timeSlot);
    setTimeSlot({
      title: "",
      startTime: "",
      endTime: "",
      participants: [],
      _id: `new-slot-${Date.now()}`,
    });
    setOpen(false);
  };
  const handleCancelTimeSlot = () => {
    setTimeSlot({
      title: "",
      startTime: "",
      endTime: "",
      participants: [],
      _id: `new-slot-${Date.now()}`,
    });
    setOpen(false);
  };
  const handleSlotChange = (
    field: keyof EventTimeSlot,
    value: Date | string | null
  ) => {
    if (!value) return;

    let updatedValue: string;

    if (value instanceof Date) {
      updatedValue = value.toLocaleTimeString("fr-FR", { hour12: false });
    } else {
      updatedValue = value;
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

  const addTimeSlot = () => {
    setOpen(true);
  };

  return (
    <>
      {open && (
        <div>
          <TextField
            label="Titre"
            name="title"
            value={timeSlot.title || ""}
            onChange={(e) => handleSlotChange("title", e.target.value)}
          />
          <TimeSlotInputs
            getExcludedTimes={() => []}
            onTimeChange={handleSlotChange}
            onRemove={() => {}}
            slot={timeSlot}
          />
          <SearchInput
            onSelect={handleParticipantSelect}
            onDelete={handleParticipantDelete}
            initialSuggestions={collaborators}
            fetchSuggestions={async (input: string) => {
              return collaborators.filter((collab) =>
                collab.username.toLowerCase().includes(input.toLowerCase())
              );
            }}
            list={timeSlot.participants}
            withIcons
            displayList
          />
          <Button onClick={handleCancelTimeSlot}>Annuler</Button>
          <Button onClick={handleValidateTimeSlot}>Ajouter le créneau</Button>
        </div>
      )}
      {!open && (
        <button type="button" onClick={addTimeSlot}>
          ➕ Ajouter un créneau
        </button>
      )}
    </>
  );
};

export default NewSlot;
