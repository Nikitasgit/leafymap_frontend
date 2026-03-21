import { MapFilters } from "@/types/map";
import type { Place } from "@/types/place";

export type MapViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export interface MapComponentProps {
  width?: string;
  height?: string;
  filters?: MapFilters;
  withDefaultMarker?: boolean;
  withPlacesInView?: boolean;
  setLoading?: (loading: boolean) => void;
  onMarkerClick?: (placeId: string) => void;
  onMapClick?: (coords: { longitude: number; latitude: number }) => void;
  onMapReady?: () => void;
  selectedPlaceId?: string;
  userMarker?: {
    location: { coordinates: number[] };
    placeCategory: { name: string };
    name: string;
    _id: string;
  };
  isFavoritesMode?: boolean;
  externalPlaces?: Place[];
  /**
   * Controlled view state. When provided, the component uses this instead of
   * its own internal state. Must be paired with `onViewStateChange`.
   */
  viewState?: MapViewState;
  /** Called on every map movement when the parent owns the view state. */
  onViewStateChange?: (vs: MapViewState) => void;
  /**
   * If true, starts the GeolocateControl once after load (`trigger()`): shows the
   * blue dot when permission allows. Pair with `followUserLocationWhenGeolocating`.
   */
  activateGeolocationOnMount?: boolean;
  /**
   * When `activateGeolocationOnMount` is true: if true, the map camera follows the
   * user on the first fix (empty URL flow). If false, only the dot is shown (URL
   * already defines the view).
   */
  followUserLocationWhenGeolocating?: boolean;
}
