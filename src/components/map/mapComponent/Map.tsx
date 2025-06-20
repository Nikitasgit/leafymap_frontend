"use client";

import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect } from "react";
import { MapCoordinates, MapMarker } from "@/types/common";
import { usePlacesInView } from "@/hooks/usePlacesInView";
import CategoryMarker from "./CategoryMarker";

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
  setLoading?: (loading: boolean) => void;
  onMarkerClick?: (placeId: string) => void;
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
  filters,
  markers = [],
  onMapClick,
  withDefaultMarker = false,
  withPlacesInView = false,
  onMarkerClick,
  setLoading,
}: MapComponentProps) => {
  const [viewState, setViewState] = useState<MapCoordinates>(
    location ?? DEFAULT_LOCATION
  );

  const { places: filteredPlaces, fetchPlacesInView } = usePlacesInView({
    filters,
  });
  console.log(filteredPlaces);

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
    <div style={{ position: "relative", width, height }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onMoveEnd={(e) => {
          if (setLoading) {
            setLoading(false);
          }
          if (withPlacesInView) {
            fetchPlacesInView(e.target.getBounds());
          }
        }}
        onClick={(e) => {
          if (onMapClick) {
            onMapClick({
              latitude: e.lngLat.lat,
              longitude: e.lngLat.lng,
            });
          }
        }}
        style={{ width, height }}
        onLoad={(e) => {
          if (setLoading) {
            setLoading(true);
          }
          if (withPlacesInView) {
            fetchPlacesInView(e.target.getBounds());
          }
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
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
              markers.length > 0
                ? markers[0].latitude
                : DEFAULT_LOCATION.latitude
            }
            color="blue"
          />
        )}

        {filteredPlaces?.map((place, index) => (
          <CategoryMarker
            key={index}
            longitude={place.location.coordinates[0]}
            latitude={place.location.coordinates[1]}
            categoryName={place.placeCategory.name}
            onClick={() => {
              if (onMarkerClick) {
                onMarkerClick(place._id);
              }
            }}
          />
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
