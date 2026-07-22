import { MapDisplayMode, MapFilters } from "@/features/map/types";

export interface MapFiltersCardProps {
  onResetFilters?: () => void;
  onFiltersChange?: (filters: MapFilters) => void;
  onApplyFilters?: (filters: MapFilters) => void;
  onClose?: () => void;
  filters: MapFilters;
  displayMode: MapDisplayMode;
  isMobile?: boolean;
}
