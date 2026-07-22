// Public API of the events feature — import from "@/features/events" only.
// Server pages needing only the API should import from "./api/eventsApi"
// to avoid pulling client hooks into the server module graph.

// API (server-safe)
export { getEventById, searchEvents } from "./api/eventsApi";

// Types
export type {
  Event,
  EventPopulated,
  EventDateRange,
} from "./types";

// Utils
export { ACTIVE_LIFECYCLE_STATUSES } from "./utils/constants";
export {
  getEventCreatorId,
  getEventLocation,
  getEventCoordinates,
  getEventLocationLabel,
} from "./utils/eventRefs";

// Hooks
export { useEvent } from "./hooks/useEvent";
export { useUserEvents } from "./hooks/useUserEvents";
export { default as useSubmitEvent } from "./hooks/useSubmitEvent";
export { default as useDeleteEvent } from "./hooks/useDeleteEvent";
export { useEventSchedule } from "./hooks/useEventSchedule";
export { useEventsSuggestions } from "./hooks/useEventsSuggestions";
export { useEventsInView } from "./hooks/useEventsInView";

// Validations
export {
  createEventNameSchema,
  createEventSchema,
  createValidateEventData,
  validateEventData,
  eventSchema,
  eventNameSchema,
} from "./validations/eventValidations";

// Components — public / profile
export { default as EventDetails } from "./components/eventDetails";
export { default as EventSchedule } from "./components/eventSchedule";
export { default as EventModal } from "./components/eventModal";

// Components — shared cards
export { default as EventCard } from "./components/eventCard";
export { default as EventSmallCard } from "./components/eventSmallCard";
export { default as EventStatus } from "./components/eventStatus";
export { default as EventsTab } from "./components/eventsTab";

// Components — account manage
export { default as EventCreateContainer } from "./components/eventCreateContainer";
export { default as EventForm } from "./components/eventForm";
export { default as AccountEventCard } from "./components/accountEventCard";
export { default as AccountEventsList } from "./components/accountEventsList";

// Components — sidebar tabs
export { MyEventsTab } from "./components/sideBarEvents";

// Components — home
export { default as EventSuggestionsList } from "./components/eventSuggestionsList";
export { default as EventSuggestionCard } from "./components/eventSuggestionCard";
