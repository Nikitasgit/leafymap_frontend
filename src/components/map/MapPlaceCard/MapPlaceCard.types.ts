import { ExtendedMapRef } from "@/types/map";

export interface MapPlaceCardProps {
  placeId: string;
  mapRef: React.RefObject<ExtendedMapRef | null>;
}
