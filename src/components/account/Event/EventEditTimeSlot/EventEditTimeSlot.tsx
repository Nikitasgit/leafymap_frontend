"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import TimeSlotInputs from "@/components/common/inputs/TimeSlotInputs";
import TextField from "@/components/common/inputs/TextField";
import Button from "@/components/common/buttons/Button";
import { EventTimeSlot } from "@/types/place/schedule";
import styles from "./EventEditTimeSlot.module.scss";
import { useToast } from "@/hooks/useToast";
import { generateTempId } from "@/utils/tempId";
import { Partnership } from "@/types/partnerships";
import PartnershipsSelect from "@/components/account/Event/EventSlotPartnershipsSelect";

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
  const { t } = useTranslation("events");
  const { showError } = useToast();
  const [timeSlot, setTimeSlot] = useState<EventTimeSlot>(
    defaultSlot || {
      title: "",
      startTime: "",
      endTime: "",
      collaborators: [],
      id: generateTempId(),
    }
  );

  const handleParticipantSelect = (partnership: Partnership) => {
    if (
      !timeSlot.collaborators?.some(
        (p) => p.id === partnership.collaborator.id
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
          (p) => p.id !== partnership.collaborator.id
        ),
      });
    }
  };

  const handleValidateTimeSlot = () => {
    if (!timeSlot.title || !timeSlot.startTime || !timeSlot.endTime) {
      showError(t("eventEditTimeSlot.requiredFieldsError"));
      if (timeSlot.title.length < 3) {
        showError(t("eventEditTimeSlot.titleMinLengthError"));
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
      id: generateTempId(),
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
      alert(t("eventEditTimeSlot.endTimeAfterStartError"));
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
        label={t("eventEditTimeSlot.titleLabel")}
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
        <Button
          variant="secondary"
          onClick={handleCancelTimeSlot}
          fullWidth
          ariaLabel={t("eventEditTimeSlot.cancelSlotAriaLabel")}
        >
          {t("common:actions.cancel")}
        </Button>
        <Button
          onClick={handleValidateTimeSlot}
          fullWidth
          ariaLabel={t("eventEditTimeSlot.validateSlotAriaLabel")}
        >
          {defaultSlot
            ? t("eventEditTimeSlot.editSlot")
            : t("eventEditTimeSlot.addSlot")}
        </Button>
      </div>
    </div>
  );
};

export default EventEditTimeSlot;
