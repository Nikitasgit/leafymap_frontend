import React, { useState } from "react";
import { EventFormData, Schedule } from "./EventForm";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import Text from "@/components/common/typography/Text";
import Button from "@/components/common/buttons/button/Button";
import SearchInput, {
  Suggestion,
} from "@/components/common/inputs/searchInput/SearchInput";
import { Plus, Trash2 } from "lucide-react";
import TimeSlotsInput, {
  TimeSlot,
} from "@/components/common/forms/timetable/TimeSlotsInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import Radio from "@/components/common/inputs/radios/radioWithLabel/Radio";

registerLocale("fr", fr);

interface ScheduleElement {
  date: string;
  endDate?: string;
  timeSlots: {
    startTime: string;
    endTime: string;
    participants: string[];
  }[];
}

const ProgramForm = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: EventFormData;
}) => {
  const [scheduleElements, setScheduleElements] = useState<ScheduleElement[]>(
    []
  );
  const [isPeriod, setIsPeriod] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentTimeSlots, setCurrentTimeSlots] = useState<TimeSlot[]>([]);
  const [currentParticipants, setCurrentParticipants] = useState<string[]>([]);

  const handleScheduleChange = (newSchedule: Schedule[]) => {
    onChange({
      target: {
        name: "schedule",
        value: newSchedule,
      },
    } as any);
  };

  const addScheduleElement = () => {
    if (!startDate) return;

    const newElement: ScheduleElement = {
      date: startDate.toISOString().split("T")[0],
      endDate: isPeriod ? endDate?.toISOString().split("T")[0] : undefined,
      timeSlots: currentTimeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        participants: currentParticipants,
      })),
    };

    const updatedElements = [...scheduleElements, newElement];
    setScheduleElements(updatedElements);

    // Convert to Schedule format and update parent
    const newSchedule: Schedule[] = updatedElements.flatMap((element) =>
      element.timeSlots.map((slot) => ({
        date: element.date,
        endDate: element.endDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        participants: slot.participants,
      }))
    );
    handleScheduleChange(newSchedule);

    setStartDate(null);
    setEndDate(null);
    setCurrentTimeSlots([]);
    setCurrentParticipants([]);
  };

  const removeScheduleElement = (index: number) => {
    const updatedElements = scheduleElements.filter((_, i) => i !== index);
    setScheduleElements(updatedElements);

    // Convert to Schedule format and update parent
    const newSchedule: Schedule[] = updatedElements.flatMap((element) =>
      element.timeSlots.map((slot) => ({
        date: element.date,
        endDate: element.endDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        participants: slot.participants,
      }))
    );
    handleScheduleChange(newSchedule);
  };

  const handleTimeSlotsChange = (timeSlots: TimeSlot[]) => {
    setCurrentTimeSlots(timeSlots);
  };

  const handleParticipantSelect = (suggestion: Suggestion) => {
    if (!currentParticipants.includes(suggestion.id)) {
      setCurrentParticipants([...currentParticipants, suggestion.id]);
    }
  };

  const handleParticipantDelete = (id: string) => {
    setCurrentParticipants(currentParticipants.filter((p) => p !== id));
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPeriod(event.target.value === "period");
    if (event.target.value === "single") {
      setEndDate(startDate);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Text as="h3">Programme de l&apos;événement</Text>

        <div className="mt-4 space-y-4">
          <div>
            <Text>Type de réservation</Text>
            <div className="flex gap-4">
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
          </div>

          <div>
            <Text>Sélectionner la période</Text>
            {isPeriod ? (
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates as [Date, Date];
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Sélectionner la période"
                locale="fr"
                className="border rounded p-2"
              />
            ) : (
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setEndDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Sélectionner la date"
                locale="fr"
                className="border rounded p-2"
              />
            )}
          </div>

          <div>
            <TimeSlotsInput
              timeSlots={currentTimeSlots}
              onChange={handleTimeSlotsChange}
              label="Créneaux horaires"
            />
          </div>

          <div>
            <Text>Participants</Text>
            <SearchInput
              onSelect={handleParticipantSelect}
              onDelete={handleParticipantDelete}
              fetchSuggestions={async (input: string) => {
                return data.collaborators.filter((collab) =>
                  collab.label.toLowerCase().includes(input.toLowerCase())
                );
              }}
              withIcons
            />
          </div>

          <Button
            onClick={addScheduleElement}
            className="flex items-center gap-2"
            disabled={!startDate || currentTimeSlots.length === 0}
          >
            <Plus size={16} />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {scheduleElements.map((element, elementIndex) => (
          <div key={elementIndex} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Text>
                  {isPeriod
                    ? `Du ${new Date(element.date).toLocaleDateString(
                        "fr-FR"
                      )} au ${new Date(element.endDate!).toLocaleDateString(
                        "fr-FR"
                      )}`
                    : `Le ${new Date(element.date).toLocaleDateString(
                        "fr-FR"
                      )}`}
                </Text>
              </div>
              <Button
                onClick={() => removeScheduleElement(elementIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              {element.timeSlots.map((slot, slotIndex) => (
                <div key={slotIndex} className="border-t pt-4">
                  <Text>
                    Créneau {slotIndex + 1}: {slot.startTime} - {slot.endTime}
                  </Text>
                  <div className="mt-2">
                    <Text>Participants</Text>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {slot.participants.map((participantId) => {
                        const participant = data.collaborators.find(
                          (c) => c.id === participantId
                        );
                        return participant ? (
                          <div
                            key={participantId}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                          >
                            {participant.icon && (
                              <img
                                src={participant.icon}
                                alt=""
                                className="w-4 h-4"
                              />
                            )}
                            <Text>{participant.label}</Text>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramForm;
