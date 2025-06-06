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
import axios from "axios";
import { Place } from "@/types/place";

interface MapFilters {
  type: string;
  category: string;
}

interface MapComponentProps {
  width?: string;
  height?: string;
  location?: MapCoordinates;
  markers?: MapMarker[];
  filters?: MapFilters;
  withDefaultMarker?: boolean;
  withPlacesInView?: boolean;
  onMarkerClick?: (place: Place) => void;
  onMapClick?: (coords: { longitude: number; latitude: number }) => void;
}

const DEFAULT_LOCATION = {
  latitude: 48.866667,
  longitude: 2.333333,
  zoom: 12,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const MapComponent = ({
  width = "100%",
  height = "100vh",
  location,
  markers = [],
  filters,
  onMapClick,
  withDefaultMarker = false,
  withPlacesInView = false,
  onMarkerClick,
}: MapComponentProps) => {
  const [viewState, setViewState] = useState<MapCoordinates | null>(null);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

  const fetchMarkersInView = async (bounds: mapboxgl.LngLatBounds | null) => {
    if (!bounds) return;
    const ne = bounds.getNorthEast().toArray();
    const sw = bounds.getSouthWest().toArray();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/places/in-view`,
        {
          params: {
            ne: JSON.stringify(ne),
            sw: JSON.stringify(sw),
            filters: JSON.stringify(filters),
          },
        }
      );
      setFilteredPlaces(response.data);
    } catch (err) {
      console.error("Failed to fetch places in view:", err);
    }
  };

  useEffect(() => {
    if (location) {
      setViewState({
        ...DEFAULT_LOCATION,
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: location.zoom ?? 12,
      });
    } else if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            ...DEFAULT_LOCATION,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setViewState(DEFAULT_LOCATION);
        }
      );
    } else {
      setViewState(DEFAULT_LOCATION);
    }
  }, [location]);

  if (!viewState) return <p>Loading map...</p>;

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={viewState}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onMoveEnd={(e) => {
        if (withPlacesInView) {
          fetchMarkersInView(e.target.getBounds());
        }
      }}
      onClick={(e) => {
        if (onMapClick) {
          onMapClick({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
        }
        setViewState({
          ...viewState,
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
        });
      }}
      style={{ width, height }}
      onLoad={(e) => {
        if (withPlacesInView) {
          fetchMarkersInView(e.target.getBounds());
        }
      }}
    >
      <FullscreenControl />
      <NavigationControl />
      <GeolocateControl />

      {withDefaultMarker && (
        <Marker
          longitude={
            markers.length > 0
              ? markers[0].longitude
              : DEFAULT_LOCATION.longitude
          }
          latitude={
            markers.length > 0 ? markers[0].latitude : DEFAULT_LOCATION.latitude
          }
          color="blue"
        />
      )}

      {filteredPlaces.map((place, index) => (
        <Marker
          key={index}
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (onMarkerClick) {
              onMarkerClick(place);
            }
          }}
          longitude={place.location.coordinates[0]}
          latitude={place.location.coordinates[1]}
          color="blue"
        />
      ))}
    </Map>
  );
};

export default MapComponent;
