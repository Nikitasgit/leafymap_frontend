export interface location {
  longitude: number;
  latitude: number;
  zoom?: number;
}
export interface marker extends location {
  draggable?: boolean;
}
export interface Address {
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
