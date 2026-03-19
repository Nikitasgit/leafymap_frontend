import { MapFilters } from "@/types/map";
import type { Place } from "@/types/place";

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
}