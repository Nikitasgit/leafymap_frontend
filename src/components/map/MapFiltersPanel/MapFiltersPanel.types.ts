import { MapFilters } from "@/types/map";

export interface MapFiltersPanelProps {
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  onResetFilters: () => void;
  onClose: () => void;
}
