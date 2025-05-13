"use client";

import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";

export interface location {
  longitude: number;
  latitude: number;
  zoom?: number;
}
export interface marker extends location {
  draggable: boolean;
}
interface MapComponentProps {
  width?: string;
  height?: string;
  location?: location;
  markers?: marker[];
  withDefaultMarker?: boolean;
  onMarkerDragEnd?: (coords: { longitude: number; latitude: number }) => void;
}

const DEFAULT_LOCATION = {
  latitude: 48.866667,
  longitude: 2.333333,
  zoom: 12,
};

const MapComponent = ({
  width = "100%",
  height = "100vh",
  location,
  markers = [],
  onMarkerDragEnd,
  withDefaultMarker = false,
}: MapComponentProps) => {
  const [viewState, setViewState] = useState<location>(
    location ?? DEFAULT_LOCATION
  );

  useEffect(() => {
    if (!location && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 12,
          });
        },
        (error) => {
          console.warn("Erreur de géolocalisation : ", error);
        }
      );
    } else if (location) {
      setViewState((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: location.zoom ?? prev.zoom,
      }));
    }
  }, [location]);

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width, height }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <FullscreenControl />
      <NavigationControl />
      <GeolocateControl />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          longitude={marker.longitude}
          latitude={marker.latitude}
          color="red"
          draggable={marker.draggable}
        />
      ))}
      {withDefaultMarker && (
        <Marker
          draggable
          longitude={location?.longitude || DEFAULT_LOCATION.longitude}
          latitude={location?.latitude || DEFAULT_LOCATION.latitude}
          onDragEnd={(e) => {
            if (onMarkerDragEnd) {
              onMarkerDragEnd({
                longitude: e.lngLat.lng,
                latitude: e.lngLat.lat,
              });
            }
          }}
        />
      )}
    </Map>
  );
};

export default MapComponent;
