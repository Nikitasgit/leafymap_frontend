import { ExtendedMapRef } from "@/types/map";

export interface MapCreatorCardProps {
  userId: string;
  mapRef: React.RefObject<ExtendedMapRef | null>;
  /** When true, navigateToPlaceOnMap will skip fetchPlacesInView (e.g. in favorites mode). */
  skipFetchPlacesInView?: boolean;
  /** Called whenever the loading state changes (used by MapCardContainer for the collapse button). */
  onLoadingChange?: (loading: boolean) => void;
}
