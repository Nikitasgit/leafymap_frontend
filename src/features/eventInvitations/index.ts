// Public API of the eventInvitations feature — import from "@/features/eventInvitations" only.

// Types
export type {
  EventInvitationEvent,
  EventInvitationPopulated,
} from "./types";

// Hooks
export { useEventInvitations } from "./hooks/useEventInvitations";
export { useEventInvitationsByUserId } from "./hooks/useEventInvitationsByUserId";
export { useEventInvitationActions } from "./hooks/useEventInvitationActions";
export { useSubmitEventInvitations } from "./hooks/useSubmitEventInvitations";

// Components — sidebar tabs
export { default as EventInvitationsReceivedTab } from "./components/eventInvitationsReceived/eventInvitationsReceivedTab";
export { default as EventParticipationsTab } from "./components/eventParticipations/eventParticipationsTab";
export { default as EventInvitationsReceivedList } from "./components/eventInvitationsReceived/eventInvitationsReceivedList";
export { default as EventParticipationsList } from "./components/eventParticipations/eventParticipationsList";

// Components — public profile composition (events + invitations)
export { default as EventDetailsWithParticipants } from "./components/eventDetailsWithParticipants";
