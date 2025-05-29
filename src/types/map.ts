export interface MapCoordinates {
  longitude: number;
  latitude: number;
  zoom?: number;
}
export interface MapMarker extends MapCoordinates {
  draggable?: boolean;
}

export interface Location {
  id: string;
  label: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

//MAPBOX
export interface MapboxFeature {
  id: string;
  place_name_fr?: string;
  place_name: string;
  center: [number, number];
}
