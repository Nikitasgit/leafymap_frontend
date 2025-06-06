import React from "react";
import Text from "@/components/common/typography/Text";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";

registerLocale("fr", fr);

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface TimeSlotsInputProps {
  timeSlots: TimeSlot[];
  onChange: (timeSlots: TimeSlot[]) => void;
  label?: string;
}

const TimeSlotsInput: React.FC<TimeSlotsInputProps> = ({
  timeSlots,
  onChange,
  label,
}) => {
  const parseTimeString = (timeString: string): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const getExcludedTimes = (
    currentIndex: number,
    isStartTime: boolean = true
  ): Date[] => {
    const excludedTimes: Date[] = [];
    const currentSlot = timeSlots[currentIndex];
    const currentStartTime = currentSlot.startTime
      ? parseTimeString(currentSlot.startTime)
      : null;
    const currentEndTime = currentSlot.endTime
      ? parseTimeString(currentSlot.endTime)
      : null;

    // Trouve la dernière heure de fin des créneaux précédents
    let lastEndTime: Date | null = null;
    for (let i = 0; i < currentIndex; i++) {
      const slot = timeSlots[i];
      if (slot.endTime) {
        const end = parseTimeString(slot.endTime);
        if (end && (!lastEndTime || end > lastEndTime)) {
          lastEndTime = end;
        }
      }
    }

    timeSlots.forEach((slot, index) => {
      if (index === currentIndex) return;
      if (!slot.startTime || !slot.endTime) return;

      const start = parseTimeString(slot.startTime);
      const end = parseTimeString(slot.endTime);

      if (!start || !end) return;

      // Si on est en train de sélectionner une heure de début
      if (currentStartTime && currentStartTime < start) {
        // Désactive toutes les heures après la fin de ce créneau
        const current = new Date(end);
        while (current <= new Date(new Date().setHours(23, 59, 0))) {
          excludedTimes.push(new Date(current));
          current.setMinutes(current.getMinutes() + 15);
        }
      }

      // Si on est en train de sélectionner une heure de fin
      if (currentEndTime && currentEndTime > end) {
        // Désactive toutes les heures après l'heure de fin sélectionnée
        const current = new Date(currentEndTime);
        while (current <= new Date(new Date().setHours(23, 59, 0))) {
          excludedTimes.push(new Date(current));
          current.setMinutes(current.getMinutes() + 15);
        }
      }

      // Désactive toutes les heures du créneau existant
      const current = new Date(start);
      while (current <= end) {
        excludedTimes.push(new Date(current));
        current.setMinutes(current.getMinutes() + 15);
      }
    });

    // Si on est en train de sélectionner une heure de début
    if (isStartTime && !currentStartTime) {
      // Si on a une heure de fin sélectionnée, désactive les heures après
      if (currentEndTime) {
        const current = new Date(currentEndTime);
        while (current <= new Date(new Date().setHours(23, 59, 0))) {
          excludedTimes.push(new Date(current));
          current.setMinutes(current.getMinutes() + 15);
        }
      }
    }

    return excludedTimes;
  };

  const isTimeOverlapping = (
    newSlot: TimeSlot,
    currentIndex: number,
    allSlots: TimeSlot[]
  ): boolean => {
    const newStart = parseTimeString(newSlot.startTime);
    const newEnd = parseTimeString(newSlot.endTime);

    if (!newStart || !newEnd) return false;

    return allSlots.some((slot, index) => {
      if (index === currentIndex) return false;
      if (!slot.startTime || !slot.endTime) return false;

      const slotStart = parseTimeString(slot.startTime);
      const slotEnd = parseTimeString(slot.endTime);

      if (!slotStart || !slotEnd) return false;

      // Vérifie si le nouveau créneau chevauche un créneau existant
      return (
        (newStart >= slotStart && newStart < slotEnd) || // Le début du nouveau créneau est dans un créneau existant
        (newEnd > slotStart && newEnd <= slotEnd) || // La fin du nouveau créneau est dans un créneau existant
        (newStart <= slotStart && newEnd >= slotEnd) // Le nouveau créneau englobe un créneau existant
      );
    });
  };

  const handleSlotChange = (
    index: number,
    field: keyof TimeSlot,
    value: Date | null
  ) => {
    if (!value) return;

    const timeString = value.toLocaleTimeString("fr-FR", { hour12: false });
    const slot = timeSlots[index];
    const updatedSlot = { ...slot, [field]: timeString };

    // Vérifie que l'heure de fin est après l'heure de début
    if (
      updatedSlot.startTime &&
      updatedSlot.endTime &&
      updatedSlot.endTime < updatedSlot.startTime
    ) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    // Vérifie les chevauchements
    if (isTimeOverlapping(updatedSlot, index, timeSlots)) {
      alert("Ce créneau horaire chevauche un créneau existant.");
      return;
    }

    const updatedSlots = timeSlots.map((s, i) =>
      i === index ? updatedSlot : s
    );
    onChange(updatedSlots);
  };

  const addTimeSlot = () => {
    // Vérifie si tous les créneaux existants sont valides
    const hasInvalidSlots = timeSlots.some(
      (slot) => !slot.startTime || !slot.endTime
    );
    if (hasInvalidSlots) {
      alert(
        "Veuillez compléter tous les créneaux existants avant d'en ajouter un nouveau."
      );
      return;
    }

    onChange([...timeSlots, { startTime: "", endTime: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    onChange(updatedSlots);
  };

  return (
    <div>
      {label && <Text>{label}</Text>}
      <div>
        {timeSlots.map((slot, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <DatePicker
              selected={parseTimeString(slot.startTime)}
              onChange={(time) => handleSlotChange(index, "startTime", time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Heure"
              dateFormat="HH:mm"
              placeholderText="Heure de début"
              locale="fr"
              className="time-picker"
              excludeTimes={getExcludedTimes(index, true)}
              onKeyDown={(e) => e.preventDefault()}
              minTime={new Date(new Date().setHours(0, 0, 0))}
              maxTime={
                slot.endTime
                  ? parseTimeString(slot.endTime)!
                  : new Date(new Date().setHours(23, 59, 0))
              }
            />
            <Text>à</Text>
            <DatePicker
              selected={parseTimeString(slot.endTime)}
              onChange={(time) => handleSlotChange(index, "endTime", time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Heure"
              dateFormat="HH:mm"
              placeholderText="Heure de fin"
              locale="fr"
              minTime={
                slot.startTime
                  ? parseTimeString(slot.startTime)!
                  : new Date(new Date().setHours(0, 0, 0))
              }
              maxTime={new Date(new Date().setHours(23, 59, 0))}
              className="time-picker"
              excludeTimes={getExcludedTimes(index, false)}
              onKeyDown={(e) => e.preventDefault()}
            />
            <button
              type="button"
              onClick={() => removeTimeSlot(index)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTimeSlot}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          ➕ Ajouter un créneau
        </button>
      </div>
    </div>
  );
};

export default TimeSlotsInput;
