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
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { usePlacesInView } from "@/hooks/usePlacesInView";
import { useEventsInView } from "@/hooks/useEventsInView";
import CategoryMarker from "../CategoryMarker";
import { ExtendedMapRef } from "@/types/map";
import { DEFAULT_LOCATION } from "@/utils/constants";
import { MapComponentProps, MapViewState } from "./Map.types";
import type { GeolocateControl as GeolocateControlInstance } from "mapbox-gl";
import { getPlaceCategoryName, getPlaceDisplayName } from "@/utils/place";
import type { Event } from "@/types/place/event";
import {
  getEventCoordinates,
  getEventCreatorId,
} from "@/lib/api/normalizers/resolveRef";

/** Delay so GeolocateControl is fully on the map before trigger. */
const GEOLOCATE_TRIGGER_MS = 500;

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};

const MapComponent = forwardRef<ExtendedMapRef, MapComponentProps>(
  (
    {
      width = "100%",
      height = "100vh",
      filters,
      onMapClick,
      onMapDragStart,
      userMarker,
      withPlacesInView = false,
      onMarkerClick,
      onEventMarkerClick,
      setLoading,
      selectedPlaceId,
      selectedEventId,
      onMapReady,
      isFavoritesMode = false,
      externalPlaces,
      viewState: controlledViewState,
      onViewStateChange,
      activateGeolocationOnMount = false,
      followUserLocationWhenGeolocating = true,
      displayMode = "places",
    },
    ref
  ) => {
    const mapRef = useRef<MapRef>(null);
    const geolocateRef = useRef<GeolocateControlInstance | null>(null);
    const geolocateTriggeredRef = useRef(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [internalSelectedPlaceId, setInternalSelectedPlaceId] = useState<
      string | null
    >(selectedPlaceId || null);

    // Uncontrolled fallback (used by PlaceForm and other simple consumers)
    const [internalViewState, setInternalViewState] = useState<MapViewState>({
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      zoom: DEFAULT_LOCATION.zoom,
    });

    const isControlled = controlledViewState !== undefined && onViewStateChange !== undefined;
    const viewState = isControlled ? controlledViewState : internalViewState;
    const setViewState = useCallback(
      (vs: MapViewState) => {
        if (isControlled) {
          onViewStateChange!(vs);
        } else {
          setInternalViewState(vs);
        }
      },
      [isControlled, onViewStateChange]
    );

    const {
      places: filteredPlaces,
      fetchPlacesInView,
      isLoading: isLoadingPlaces,
    } = usePlacesInView({ filters });
    const {
      events: filteredEvents,
      fetchEventsInView,
      isLoading: isLoadingEvents,
    } = useEventsInView({ filters });

    const shouldFetchInView = withPlacesInView && !isFavoritesMode;
    const isLoading =
      displayMode === "events" ? isLoadingEvents : isLoadingPlaces;

    const placesToShow =
      isFavoritesMode && Array.isArray(externalPlaces)
        ? externalPlaces
        : filteredPlaces;

    useImperativeHandle(
      ref,
      () => ({
        ...(mapRef.current ?? ({} as MapRef)),
        fetchPlacesInView: (bounds: mapboxgl.LngLatBounds | null) =>
          fetchPlacesInView(bounds, mapRef as React.RefObject<MapRef>),
        fetchEventsInView: (bounds: mapboxgl.LngLatBounds | null) =>
          fetchEventsInView(bounds, mapRef as React.RefObject<MapRef>),
        setSelectedPlaceId: setInternalSelectedPlaceId,
        isReady: Boolean(mapRef.current && isMapReady),
      }),
      [isMapReady, fetchPlacesInView, fetchEventsInView]
    );

    useEffect(() => {
      if (setLoading) setLoading(isLoading);
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    // Start GeolocateControl once: with trackUserLocation + followUserLocation false,
    // Mapbox only draws the dot without moving the camera (see mapbox-gl _onSuccess).
    useEffect(() => {
      if (!isMapReady || !activateGeolocationOnMount || geolocateTriggeredRef.current)
        return;
      geolocateTriggeredRef.current = true;
      const timeoutId = window.setTimeout(() => {
        geolocateRef.current?.trigger();
      }, GEOLOCATE_TRIGGER_MS);
      return () => window.clearTimeout(timeoutId);
    }, [isMapReady, activateGeolocationOnMount]);

    return (
      <div style={{ position: "relative", width, height }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          onMoveEnd={(e) => {
            if (shouldFetchInView) {
              if (displayMode === "events") {
                fetchEventsInView(e.target.getBounds());
              } else {
                fetchPlacesInView(e.target.getBounds());
              }
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
          onDragStart={() => {
            onMapDragStart?.();
          }}
          style={{ width, height }}
          onLoad={(e) => {
            if (shouldFetchInView) {
              if (displayMode === "events") {
                fetchEventsInView(e.target.getBounds());
              } else {
                fetchPlacesInView(e.target.getBounds());
              }
            }
            setIsMapReady(true);
            if (typeof onMapReady === "function") onMapReady();
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <NavigationControl />
          <GeolocateControl
            ref={geolocateRef}
            showUserLocation
            showAccuracyCircle
            trackUserLocation={activateGeolocationOnMount}
            followUserLocation={
              activateGeolocationOnMount
                ? followUserLocationWhenGeolocating
                : true
            }
            positionOptions={GEO_OPTIONS}
          />

          {displayMode === "places" &&
            placesToShow?.map((place) =>
              place && place.location ? (
                <CategoryMarker
                  key={place._id}
                  longitude={place.location.coordinates[0]}
                  latitude={place.location.coordinates[1]}
                  categoryName={getPlaceCategoryName(place.placeCategory)}
                  placeName={getPlaceDisplayName(place)}
                  zoom={viewState.zoom}
                  isSelected={place._id === internalSelectedPlaceId}
                  onClick={() => {
                    setInternalSelectedPlaceId(place._id);
                    const userId =
                      place.user && typeof place.user === "object"
                        ? (place.user as { _id: string })._id
                        : undefined;
                    if (userId && onMarkerClick) {
                      onMarkerClick(userId);
                    }
                  }}
                />
              ) : null
            )}

          {displayMode === "events" &&
            filteredEvents.map((event) => {
              const coordinates = getEventCoordinates(event);
              const creatorId = getEventCreatorId(event);
              const categoryName =
                typeof event.eventCategory === "object"
                  ? event.eventCategory.name
                  : "event";
              if (!coordinates || !creatorId) return null;
              const [longitude, latitude] = coordinates;
              return (
                <CategoryMarker
                  key={event._id}
                  longitude={longitude}
                  latitude={latitude}
                  categoryName={categoryName}
                  placeName={event.name}
                  zoom={viewState.zoom}
                  isSelected={event._id === selectedEventId}
                  onClick={() =>
                    onEventMarkerClick?.(creatorId, event._id, coordinates)
                  }
                />
              );
            })}

          {userMarker && userMarker.location && (
            <CategoryMarker
              key={userMarker._id}
              longitude={userMarker.location.coordinates[0]}
              latitude={userMarker.location.coordinates[1]}
              categoryName={userMarker.placeCategory.name}
              placeName={userMarker.name}
              zoom={viewState.zoom}
              isSelected={userMarker._id === internalSelectedPlaceId}
            />
          )}
        </Map>
      </div>
    );
  }
);

MapComponent.displayName = "MapComponent";
export default MapComponent;
