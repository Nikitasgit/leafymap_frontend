import { ExtendedMapRef } from "@/features/map/types";

export interface MapCreatorCardProps {
  userId: string;
  initialEventId?: string | null;
  mapRef: React.RefObject<ExtendedMapRef | null>;
  /** When true, navigateToPlaceOnMap will skip fetchPlacesInView (e.g. in favorites mode). */
  skipFetchPlacesInView?: boolean;
  /** Called whenever the loading state changes (used by MapCardContainer to hide the handle while loading). */
  onLoadingChange?: (loading: boolean) => void;
}
