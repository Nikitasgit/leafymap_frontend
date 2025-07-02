import React, { useState } from "react";
import { EventFormData, Period } from "./EventForm";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import Text from "@/components/common/typography/Text";
import Button from "@/components/common/buttons/button/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { format, startOfDay } from "date-fns";
import NewSlot from "@/components/common/timetable/NewSlot";
import Slots from "./Slots";
import { TimeSlot } from "@/components/common/timetable/timeSlotInputs/TimeSlotInputs";
import EventScheduleList from "./EventScheduleList";

registerLocale("fr", fr);

const ProgramForm = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: EventFormData;
}) => {
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<Period>({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    timeSlots: [],
  });

  const handleAddPeriod = () => {
    setIsAddingPeriod(true);
    setCurrentPeriod({
      startDate: format(new Date(), "dd-MM-yyyy"),
      endDate: format(new Date(), "dd-MM-yyyy"),
      timeSlots: [],
    });
  };

  const handleAddTimeSlot = (timeSlot: TimeSlot) => {
    setCurrentPeriod({
      ...currentPeriod,
      timeSlots: [...currentPeriod.timeSlots, timeSlot],
    });
  };
  const handleCancelPeriod = () => {
    setIsAddingPeriod(false);
    setCurrentPeriod({
      startDate: format(new Date(), "dd-MM-yyyy"),
      endDate: format(new Date(), "dd-MM-yyyy"),
      timeSlots: [],
    });
    setStartDate(null);
    setEndDate(null);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setCurrentPeriod({
        ...currentPeriod,
        startDate: format(startOfDay(start), "dd-MM-yyyy"),
        endDate: format(startOfDay(end), "dd-MM-yyyy"),
      });
    }
  };

  const handleSavePeriod = () => {
    if (!currentPeriod.startDate || !currentPeriod.endDate) {
      return;
    }
    const updatedSchedule = [...data.schedule, currentPeriod];
    onChange({
      target: {
        name: "schedule",
        value: updatedSchedule,
      },
    });
    setCurrentPeriod({
      startDate: format(new Date(), "dd-MM-yyyy"),
      endDate: format(new Date(), "dd-MM-yyyy"),
      timeSlots: [],
    });
    setStartDate(null);
    setEndDate(null);
    setIsAddingPeriod(false);
  };

  return (
    <div>
      <div>
        <Text as="h3">Programme de l&apos;événement</Text>
        {isAddingPeriod ? (
          <>
            <Button onClick={handleCancelPeriod}>Annuler</Button>
            <Button onClick={handleSavePeriod}>Enregistrer</Button>
          </>
        ) : (
          <Button onClick={handleAddPeriod}>Ajouter des dates</Button>
        )}
        {isAddingPeriod && (
          <>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Sélectionner la période"
              locale="fr"
            />
            <NewSlot
              collaborators={data.collaborators}
              period={currentPeriod}
              onChange={handleAddTimeSlot}
            />
            <Slots slots={currentPeriod.timeSlots} />
          </>
        )}
      </div>
      <EventScheduleList schedule={data.schedule} />
    </div>
  );
};

export default ProgramForm;
