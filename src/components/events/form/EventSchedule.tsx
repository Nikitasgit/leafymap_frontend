import React from "react";
import { Schedule, Collaborator } from "./EventForm";
import Text from "@/components/common/typography/Text";
import Image from "next/image";

interface EventScheduleProps {
  schedule: Schedule[];
  collaborators: Collaborator[];
}

const EventSchedule: React.FC<EventScheduleProps> = ({
  schedule,
  collaborators,
}) => {
  if (schedule.length === 0) {
    return null;
  }

  const getParticipantInfo = (participantId: string) => {
    return collaborators.find((collab) => collab.id === participantId);
  };

  return (
    <div className="mt-4">
      <Text as="h3">Créneaux programmés</Text>
      <div className="space-y-4">
        {schedule.map((slot, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <Text>
                  Date: {new Date(slot.date).toLocaleDateString("fr-FR")}
                </Text>
                <Text>
                  Heure: {slot.startTime} - {slot.endTime}
                </Text>
              </div>
            </div>
            {slot.participants.length > 0 && (
              <div className="mt-2">
                <Text>Participants:</Text>
                <ul className="list-disc list-inside">
                  {slot.participants.map((participantId) => {
                    const participant = getParticipantInfo(participantId);
                    return participant ? (
                      <li
                        key={participantId}
                        className="flex items-center gap-2"
                      >
                        {participant.icon && (
                          <Image
                            src={participant.icon}
                            alt={participant.label}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span>{participant.label}</span>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSchedule;
