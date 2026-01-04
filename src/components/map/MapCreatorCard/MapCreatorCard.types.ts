import { ExtendedMapRef } from "@/types/map";

export interface MapCreatorCardProps {
  placeId: string;
  mapRef: React.RefObject<ExtendedMapRef | null>;
}
