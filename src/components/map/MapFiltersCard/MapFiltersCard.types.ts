import { MapFilters } from "@/types/map";

export interface MapFiltersCardProps {
  onResetFilters?: () => void;
  onFiltersChange?: (filters: MapFilters) => void;
  onApplyFilters?: (filters: MapFilters) => void;
  onClose?: () => void;
  filters: MapFilters;
  isMobile?: boolean;
}
