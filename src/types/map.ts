export interface MapCoordinates {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: { top: number; bottom: number; left: number; right: number };
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
