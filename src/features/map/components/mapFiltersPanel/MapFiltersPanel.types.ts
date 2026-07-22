import { MapDisplayMode, MapFilters } from "@/features/map/types";

export interface MapFiltersPanelProps {
  filters: MapFilters;
  displayMode: MapDisplayMode;
  setFilters: (filters: MapFilters) => void;
  onResetFilters: () => void;
  onClose: () => void;
}
