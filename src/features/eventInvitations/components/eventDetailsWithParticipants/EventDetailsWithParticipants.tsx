"use client";

import React from "react";
import EventDetails from "@/features/events/components/eventDetails";
import type { EventPopulated } from "@/features/events/types/event";
import type { UsersListXScrollUser } from "@/features/users/components/usersListXScroll";
import type { PlacePopulated } from "@/features/places/types/place";
import type { UserPopulated } from "@/features/users/types";
import { useEventInvitations } from "../../hooks/useEventInvitations";

export interface EventDetailsWithParticipantsProps {
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
  isContentLoading?: boolean;
}

const EventDetailsWithParticipants: React.FC<
  EventDetailsWithParticipantsProps
> = ({ event, place, user, isContentLoading = false }) => {
  const { eventInvitations, isLoading: participantsLoading } =
    useEventInvitations(event.id, { onlyAccepted: "true" });

  const participants = eventInvitations
    .map((invitation) => invitation.collaborator)
    .filter(
      (collaborator): collaborator is NonNullable<typeof collaborator> =>
        collaborator !== undefined,
    ) as UsersListXScrollUser[];

  return (
    <EventDetails
      event={event}
      place={place}
      user={user}
      participants={participants}
      participantsLoading={participantsLoading}
      isContentLoading={isContentLoading}
    />
  );
};

export default EventDetailsWithParticipants;
