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
import CategoryMarker from "../CategoryMarker/CategoryMarker";
import { ExtendedMapRef } from "@/types/map";
import { DEFAULT_LOCATION } from "@/utils/constants";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MapComponentProps } from "./Map.types";
import { User } from "@/types/user";

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
    const mapRef = useRef<MapRef>(null);
    const { latitude, longitude } = useGeolocation();
    const [isMapReady, setIsMapReady] = useState(false);
    const [internalSelectedPlaceId, setInternalSelectedPlaceId] = useState<
      string | null
    >(selectedPlaceId || null);
    const [viewState, setViewState] = useState({
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      zoom: DEFAULT_LOCATION.zoom,
    });

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
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (latitude && longitude && isMapReady) {
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
                placeName={
                  typeof place === "object" && "user" in place && place.user != null
                    ? (place.user as User).username
                    : "name" in place && typeof place.name === "string"
                    ? place.name
                    : ""
                }
                zoom={viewState.zoom}
                isSelected={place._id === internalSelectedPlaceId}
                onClick={() => {
                  setInternalSelectedPlaceId(place._id);
                  if (onMarkerClick) {
                    const userId =
                      typeof place === "object" && "user" in place
                        ? (place.user as User)?._id
                        : undefined;
                    if (userId) {
                      onMarkerClick(userId);
                    }
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
