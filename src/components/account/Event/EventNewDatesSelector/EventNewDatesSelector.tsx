"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { initialEventData } from "../EventForm/EventForm.types";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";
import Button from "@/components/common/buttons/Button";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";
import DatesSelector from "@/components/common/inputs/DatesSelector";
import styles from "./EventNewDatesSelector.module.scss";
import { generateTempId } from "@/utils/tempId";
import { Period } from "@/types/place/schedule";

registerLocale("fr", fr);

const EventNewDatesSelector = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: initialEventData;
}) => {
  const { t } = useTranslation("events");
  const { showError } = useToast();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isPeriod, setIsPeriod] = useState(false);
  const handleSaveDates = () => {
    if (isPeriod) {
      if (!startDate || !endDate) {
        showError(t("eventNewDatesSelector.selectPeriodError"));
        return;
      }
    } else {
      if (!startDate) {
        showError(t("eventNewDatesSelector.selectDateError"));
        return;
      }
    }
    const updatedPeriod = {
      startDate: format(startDate, "dd-MM-yyyy"),
      endDate: isPeriod && endDate ? format(endDate, "dd-MM-yyyy") : "",
      timeSlots: [],
      id: generateTempId(),
    };
    const updatedSchedule = [...data.schedule, updatedPeriod];
    onChange({
      target: {
        name: "schedule",
        value: updatedSchedule as Period[],
      },
    });
    setStartDate(null);
    setEndDate(null);
  };

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const addButtonLabel =
    isPeriod && startDate && endDate
      ? t("eventNewDatesSelector.addThisPeriod")
      : isPeriod && !startDate && !endDate
      ? t("eventNewDatesSelector.addPeriod")
      : !isPeriod && startDate
      ? t("eventNewDatesSelector.addThisDate")
      : t("eventNewDatesSelector.addDate");

  return (
    <fieldset className={styles.scheduleEventForm}>
      <legend className={styles.title}>{t("eventNewDatesSelector.title")}</legend>
      <div className={styles.periodContainer}>
        <DatesSelector
          title={t("eventNewDatesSelector.addDatesTitle")}
          startDate={startDate || null}
          endDate={endDate || null}
          onDateChange={handleDateChange}
          isPeriod={isPeriod}
          setIsPeriod={setIsPeriod}
        />
        <Button
          onClick={handleSaveDates}
          ariaLabel={t("eventNewDatesSelector.addDatesAriaLabel")}
        >
          {addButtonLabel}
        </Button>
      </div>
    </fieldset>
  );
};

export default EventNewDatesSelector;
