import { ExtendedMapRef, MapFilters } from "@/types/map";

export type MapCardContainerProps = {
  selectedItem: { id: string; type: "place" | "user" | "filters" | null };
  mapRef: React.RefObject<ExtendedMapRef | null>;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  onResetFilters: () => void;
};
