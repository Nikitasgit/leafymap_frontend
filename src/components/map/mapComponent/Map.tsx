"use client";

import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";
import { MapCoordinates, MapMarker } from "@/types/map";

interface MapComponentProps {
  width?: string;
  height?: string;
  location?: MapCoordinates;
  markers?: MapMarker[];
  withDefaultMarker?: boolean;
  onMapClick?: (coords: { longitude: number; latitude: number }) => void;
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
  onMapClick,
  withDefaultMarker = false,
}: MapComponentProps) => {
  const [viewState, setViewState] = useState<MapCoordinates>(
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
        zoom: location.zoom ?? prev.zoom ?? 12,
      }));
    }
  }, [location]);

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      onClick={(e) => {
        if (onMapClick) {
          onMapClick({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
        }
      }}
      style={{ width, height }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <FullscreenControl />
      <NavigationControl />
      <GeolocateControl />
      {withDefaultMarker && markers.length === 0 && (
        <Marker
          longitude={DEFAULT_LOCATION.longitude}
          latitude={DEFAULT_LOCATION.latitude}
          color="blue"
        />
      )}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          longitude={marker.longitude}
          latitude={marker.latitude}
          color="blue"
          draggable={marker.draggable}
        />
      ))}
    </Map>
  );
};

export default MapComponent;
