export interface CategoryMarkerProps {
    longitude: number;
    latitude: number;
    categoryName: string;
    placeName?: string;
    onClick?: () => void;
    zoom?: number;
    isSelected?: boolean;
  }