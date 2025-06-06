import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Text from "@/components/common/typography/Text";
import { Schedule } from "./EventForm";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import Radio from "@/components/common/inputs/radios/radioWithLabel/Radio";
import TimeSlotsInput, {
  TimeSlot,
} from "@/components/common/forms/timetable/TimeSlotsInput";

registerLocale("fr", fr);

interface ProgramDateFormProps {
  onScheduleChange: (schedule: Schedule[]) => void;
  schedule: Schedule[];
}

const ProgramDateForm: React.FC<ProgramDateFormProps> = ({
  onScheduleChange,
  schedule,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { startTime: "", endTime: "" },
  ]);
  const [isPeriod, setIsPeriod] = useState(false);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(isPeriod ? end : start);

    if (
      start &&
      timeSlots.length > 0 &&
      timeSlots[0].startTime &&
      timeSlots[0].endTime
    ) {
      const newSchedule: Schedule = {
        date: start.toISOString().split("T")[0],
        startTime: timeSlots[0].startTime,
        endTime: timeSlots[0].endTime,
        participants: [],
      };
      onScheduleChange([...schedule, newSchedule]);
    }
  };

  const handleTimeSlotsChange = (newTimeSlots: TimeSlot[]) => {
    setTimeSlots(newTimeSlots);
    if (
      startDate &&
      newTimeSlots.length > 0 &&
      newTimeSlots[0].startTime &&
      newTimeSlots[0].endTime
    ) {
      const newSchedule: Schedule = {
        date: startDate.toISOString().split("T")[0],
        startTime: newTimeSlots[0].startTime,
        endTime: newTimeSlots[0].endTime,
        participants: [],
      };
      onScheduleChange([...schedule, newSchedule]);
    }
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPeriod(event.target.value === "period");
    if (event.target.value === "single") {
      setEndDate(startDate);
    }
  };

  return (
    <div>
      <div>
        <Text>Type de réservation</Text>
        <Radio
          label="Un jour"
          name="periodType"
          value="single"
          checked={!isPeriod}
          onChange={handlePeriodChange}
        />
        <Radio
          label="Période"
          name="periodType"
          value="period"
          checked={isPeriod}
          onChange={handlePeriodChange}
        />
      </div>

      <Text>Sélectionner la période</Text>
      {isPeriod ? (
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
      ) : (
        <DatePicker
          selected={startDate}
          onChange={(date) => handleDateChange([date, date])}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          placeholderText="Sélectionner la date"
          locale="fr"
        />
      )}

      <div style={{ marginTop: "16px" }}>
        <TimeSlotsInput
          timeSlots={timeSlots}
          onChange={handleTimeSlotsChange}
          label="Créneaux horaires"
        />
      </div>
    </div>
  );
};

export default ProgramDateForm;
