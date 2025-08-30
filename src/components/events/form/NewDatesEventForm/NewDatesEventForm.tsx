import React, { useState } from "react";
import { EventFormData } from "../EventForm/EventForm";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import Button from "@/components/common/buttons/button/Button";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";
import DateFilter from "@/components/map/filtersCardMap/dateFilter/DateFilter";
import styles from "./NewDatesEventForm.module.scss";
import { generateTempId } from "@/utils/tempId";

registerLocale("fr", fr);

const NewDatesEventForm = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: EventFormData;
}) => {
  const { showError } = useToast();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isPeriod, setIsPeriod] = useState(false);
  const handleSaveDates = () => {
    if (isPeriod) {
      if (!startDate || !endDate) {
        showError("Veuillez sélectionner une période");
        return;
      }
    } else {
      if (!startDate) {
        showError("Veuillez sélectionner une date");
        return;
      }
    }
    const updatedPeriod = {
      startDate: format(startDate, "dd-MM-yyyy"),
      endDate: isPeriod && endDate ? format(endDate, "dd-MM-yyyy") : "",
      timeSlots: [],
      _id: generateTempId(),
    };
    const updatedSchedule = [...data.schedule, updatedPeriod];
    onChange({
      target: {
        name: "schedule",
        value: updatedSchedule,
      },
    });
    setStartDate(null);
    setEndDate(null);
  };

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <section className={styles.scheduleEventForm}>
      <h3 className={styles.title}>Dates et horaires</h3>
      <div className={styles.periodContainer}>
        <DateFilter
          title="Ajouter des dates"
          startDate={startDate || null}
          endDate={endDate || null}
          onDateChange={handleDateChange}
          isPeriod={isPeriod}
          setIsPeriod={setIsPeriod}
        />
        <Button onClick={handleSaveDates}>
          {isPeriod && startDate && endDate
            ? "Ajouter cette période"
            : isPeriod && !startDate && !endDate
            ? "Ajouter une période"
            : !isPeriod && startDate
            ? "Ajouter cette date"
            : "Ajouter une date"}
        </Button>
      </div>
    </section>
  );
};

export default NewDatesEventForm;
