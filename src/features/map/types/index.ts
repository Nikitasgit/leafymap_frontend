import { MapRef } from "react-map-gl/mapbox";

export interface ExtendedMapRef extends MapRef {
  fetchPlacesInView: (bounds: mapboxgl.LngLatBounds | null) => void;
  fetchEventsInView: (bounds: mapboxgl.LngLatBounds | null) => void;
  setSelectedPlaceId: (placeId: string | null) => void;
  isReady: boolean;
}

export * from "./filters";
