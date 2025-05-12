"use client";

import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";

const MapComponent = ({
  width = "100%",
  height = "100vh",
  location = {
    latitude: 48.866667,
    longitude: 2.333333,
  },
}: {
  width: string;
  height: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}) => {
  const [viewState, setViewState] = useState({
    ...location,
    zoom: 12,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setViewState((prev) => ({
          ...prev,
          ...location,
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

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
    </Map>
  );
};

export default MapComponent;
