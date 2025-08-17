export interface BaseEntity {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
  label: string;
  id?: string;
}

export interface MapCoordinates {
  longitude: number;
  latitude: number;
  zoom?: number;
}

export interface MapMarker extends MapCoordinates {
  draggable?: boolean;
}

export interface LocationWithLabel {
  id: string;
  label: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

export interface MapboxFeature {
  id: string;
  place_name_fr?: string;
  place_name: string;
  center: [number, number];
}
