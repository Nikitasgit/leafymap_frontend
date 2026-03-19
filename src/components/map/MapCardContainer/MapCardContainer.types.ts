import { ExtendedMapRef } from "@/types/map";

export type MapCardContainerProps = {
  selectedItem: { id: string; type: "creator" | "filters" | null };
  mapRef: React.RefObject<ExtendedMapRef | null>;
  isFavoritesMode?: boolean;
};
