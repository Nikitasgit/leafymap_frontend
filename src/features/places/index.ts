// Public API of the places feature — import from "@/features/places" only.
// Server pages needing only the API should import from "./api/placesApi"
// to avoid pulling client hooks into the server module graph.

// API (server-safe)
export { getPlacesByIds } from "./api/placesApi";

// Types
export type {
  Place,
  PlacePopulated,
  DefaultSchedule,
  DaySchedule,
  TimeSlot,
  EventTimeSlot,
  Period,
  WeekDay,
  ScheduleEventPreview,
  Collaborator,
} from "./types";

// Hooks
export { usePlace } from "./hooks/usePlace";
export { default as useSubmitPlace } from "./hooks/useSubmitPlace";
export { default as useDeletePlace } from "./hooks/useDeletePlace";
export { usePlacesInView } from "./hooks/usePlacesInView";

// Validations
export {
  createPlaceCategorySchema,
  createLocationSchema,
  createPlaceFormSchema,
  createValidateNewPlaceData,
  placeFormSchema,
  placeCategorySchema,
  locationSchema,
  validateNewPlaceData,
} from "./validations/placeValidations";

// Utils
export { getPlaceCategoryName, getPlaceDisplayName } from "./utils/place";
export { cleanIncompleteTimeSlots } from "./utils/schedule";
export { getStrictExcludedTimes } from "./utils/timetable";

// Components
export { default as PlaceForm } from "./components/placeForm";
export { default as PlaceFormContainer } from "./components/placeFormContainer";
export { default as CreatePlaceContainer } from "./components/createPlaceContainer";
export { default as UpdatePlaceContainer } from "./components/updatePlaceContainer";
export { default as DefaultScheduleForm } from "./components/defaultScheduleForm";
export { default as DefaultScheduleDay } from "./components/defaultScheduleDay";
export { default as PlaceCategoryBadge } from "./components/placeCategoryBadge";
export { default as TimeSlotInputs } from "./components/timeSlotInputs";
