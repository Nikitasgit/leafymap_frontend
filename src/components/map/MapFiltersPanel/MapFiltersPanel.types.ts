import { MapDisplayMode, MapFilters } from "@/types/map";

export interface MapFiltersPanelProps {
  filters: MapFilters;
  displayMode: MapDisplayMode;
  setFilters: (filters: MapFilters) => void;
  onResetFilters: () => void;
  onClose: () => void;
}
