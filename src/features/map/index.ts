// Public API of the map feature — import from "@/features/map" only.
// Prefer deep imports for types from "./types" when used by places/events
// hooks to avoid pulling the full client map barrel into those modules.

// Types
export type {
  ExtendedMapRef,
  MapDisplayMode,
  MapFilters,
} from "./types";

// Hooks
export { useMapViewState } from "./hooks/useMapViewState";
export type { MapViewState } from "./hooks/useMapViewState";
export { useGeolocation } from "./hooks/useGeolocation";
// Utils
export {
  applyPixelOffsetToLocation,
  buildUserMarker,
  getLocationFromCoordinates,
  fetchLocationSuggestions,
} from "./utils/map";
export { navigateToPlaceOnMap, handleGetDirections } from "./utils/mapNavigation";
export { computeBounds } from "./utils/mapBounds";
export {
  DEFAULT_LOCATION,
  FRANCE_VIEW,
  USER_MARKER,
} from "./utils/constants";

// Components
export { default as MapPageContainer } from "./components/mapPageContainer";
export { default as MapComponent } from "./components/mapComponent";
export { default as CategoryMarker } from "./components/categoryMarker";
export { default as MapFiltersBar } from "./components/mapFiltersBar";
export { default as MapFiltersCard } from "./components/mapFiltersCard";
export { default as MapFiltersPanel } from "./components/mapFiltersPanel";
export { default as PlaceCategoryFilter } from "./components/placeCategoryFilter";
export { default as MapCardContainer } from "./components/mapCardContainer";
export { default as MapCreatorCard } from "./components/mapCreatorCard";
export { default as MapCreatorCardContent } from "./components/mapCreatorCardContent";
export { default as MapCreatorCardPartnerships } from "./components/mapCreatorCardPartnerships";
export { default as MapPlaceCardSchedule } from "./components/mapPlaceCardSchedule";
export { default as LocationPicker } from "./components/locationPicker";
export { default as AddressInput } from "./components/addressInput";
