"use client";

import Map, {
  GeolocateControl,
  NavigationControl,
  MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { usePlacesInView } from "@/hooks/usePlacesInView";
import CategoryMarker from "./CategoryMarker";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import { DEFAULT_LOCATION } from "@/utils/constants";
import { useGeolocation } from "@/hooks/useGeolocation";

interface MapComponentProps {
  width?: string;
  height?: string;
  filters?: MapFilters;
  withDefaultMarker?: boolean;
  withPlacesInView?: boolean;
  setLoading?: (loading: boolean) => void;
  onMarkerClick?: (placeId: string) => void;
  onMapClick?: (coords: { longitude: number; latitude: number }) => void;
  onMapReady?: () => void;
  selectedPlaceId?: string;
  userMarker?: {
    location: { coordinates: number[] };
    placeCategory: { name: string };
    name: string;
    _id: string;
  };
}

const MapComponent = forwardRef<ExtendedMapRef, MapComponentProps>(
  (
    {
      width = "100%",
      height = "100vh",
      filters,
      onMapClick,
      userMarker,
      withPlacesInView = false,
      onMarkerClick,
      setLoading,
      selectedPlaceId,
      onMapReady,
    },
    ref
  ) => {
    const { latitude, longitude } = useGeolocation();
    const [viewState, setViewState] = useState({
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      zoom: DEFAULT_LOCATION.zoom,
    });
    const [isMapReady, setIsMapReady] = useState(false);
    const mapRef = useRef<MapRef>(null);
    const [internalSelectedPlaceId, setInternalSelectedPlaceId] = useState<
      string | null
    >(selectedPlaceId || null);

    const {
      places: filteredPlaces,
      fetchPlacesInView,
      isLoading,
    } = usePlacesInView({
      filters,
    });

    const filteredMarkersWithUserMarker = userMarker
      ? [...filteredPlaces, userMarker]
      : filteredPlaces;

    useImperativeHandle(
      ref,
      () => ({
        ...mapRef.current!,
        fetchPlacesInView: (bounds: mapboxgl.LngLatBounds | null) =>
          fetchPlacesInView(bounds, mapRef as React.RefObject<MapRef>),
        setSelectedPlaceId: setInternalSelectedPlaceId,
        isReady: isMapReady,
      }),
      [isMapReady, fetchPlacesInView]
    );

    useEffect(() => {
      if (setLoading) {
        setLoading(isLoading);
      }
    }, [isLoading]);

    useEffect(() => {
      if (latitude && longitude) {
        setViewState({
          latitude,
          longitude,
          zoom: DEFAULT_LOCATION.zoom,
        });
      }
    }, [latitude, longitude, isMapReady]);

    return (
      <div style={{ position: "relative", width, height }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          onMoveEnd={(e) => {
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
            if (withPlacesInView) {
              fetchPlacesInView(e.target.getBounds());
            }
            setIsMapReady(true);
            if (typeof onMapReady === "function") {
              onMapReady();
            }
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <NavigationControl />
          <GeolocateControl />

          {filteredMarkersWithUserMarker?.map((place, index) =>
            place && place.location ? (
              <CategoryMarker
                key={index}
                longitude={place.location.coordinates[0]}
                latitude={place.location.coordinates[1]}
                categoryName={
                  typeof place.placeCategory === "string"
                    ? place.placeCategory
                    : place.placeCategory.name
                }
                placeName={place.name}
                zoom={viewState.zoom}
                isSelected={place._id === internalSelectedPlaceId}
                onClick={() => {
                  setInternalSelectedPlaceId(place._id);
                  if (onMarkerClick) {
                    onMarkerClick(place._id);
                  }
                }}
              />
            ) : null
          )}
        </Map>
      </div>
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;
