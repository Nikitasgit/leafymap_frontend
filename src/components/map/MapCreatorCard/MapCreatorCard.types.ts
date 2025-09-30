import { ExtendedMapRef } from "@/types/map";

export interface MapCreatorCardProps {
  userId: string;
  mapRef?: React.RefObject<ExtendedMapRef | null>;
}
