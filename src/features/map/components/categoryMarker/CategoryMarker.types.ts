export interface CategoryMarkerProps {
  longitude: number;
  latitude: number;
  categoryName: string;
  categoryKind?: "place" | "event";
  placeName?: string;
  onClick?: () => void;
  zoom?: number;
  isSelected?: boolean;
}
