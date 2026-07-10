"use client";

import MapComponent from "@/components/common/Map/MapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./MapPageContainer.module.scss";
import MapFiltersBar from "@/components/map/MapFiltersBar";
import { MapDisplayMode, MapFilters, ExtendedMapRef } from "@/types/map";
import MapCardContainer from "@/components/map/MapCardContainer";
import MapFiltersPanel from "@/components/map/MapFiltersPanel";
import { useAppSelector } from "@/store";
import { selectPlaceFavorites } from "@/store/favoritesSlice";
import { getPlacesByIds } from "@/lib/api/places";
import { FRANCE_VIEW } from "@/utils/constants";
import { computeBounds } from "@/utils/mapBounds";
import type { Place } from "@/types/place";
import type { LngLatBoundsLike } from "mapbox-gl";
import { SearchResult } from "./MapPageContainer.types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMapViewState } from "@/hooks/useMapViewState";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";

const defaultFilters: MapFilters = {
  placeTypes: [],
  placeCategories: [],
  eventCategories: [],
  minRating: null,
  userCategoryIds: [],
  productCategoryIds: [],
  startDate: null,
  endDate: null,
};

const MapPageContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    viewState,
    onViewStateChange,
    shouldFollowUserOnGeolocate,
    isResolvingPosition,
  } = useMapViewState();

  const initialCreatorId = searchParams.get("creator");
  const initialEventId = searchParams.get("event");
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: "creator" | "filters" | null;
    eventId?: string | null;
  }>(
    initialCreatorId
      ? { id: initialCreatorId, type: "creator", eventId: initialEventId }
      : { id: "", type: null }
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>("events");
  const [isFavoritesMode, setIsFavoritesMode] = useState(false);
  const [favoritesPlaces, setFavoritesPlaces] = useState<Place[]>([]);
  const favoritesBounds = useRef<LngLatBoundsLike | null>(null);
  const mapRef = useRef<ExtendedMapRef | null>(null);
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
  const placeFavoriteIds = useAppSelector(selectPlaceFavorites);

  const exitFavoritesMode = useCallback(() => {
    setIsFavoritesMode(false);
    setFavoritesPlaces([]);
    if (mapRef.current?.isReady) {
      mapRef.current.fetchPlacesInView(null);
    }
  }, []);

  const handleFavoritesModeToggle = useCallback(async () => {
    if (isFavoritesMode) {
      exitFavoritesMode();
      return;
    }
    if (placeFavoriteIds.length === 0) {
      favoritesBounds.current = null;
      setIsFavoritesMode(true);
      setFavoritesPlaces([]);
      return;
    }
    try {
      const places = await getPlacesByIds(placeFavoriteIds);
      const coords = places
        .map((p) => p.location?.coordinates as [number, number] | undefined)
        .filter((c): c is [number, number] => !!c);
      favoritesBounds.current = computeBounds(coords);
      setFavoritesPlaces(places);
      setIsFavoritesMode(true);
    } catch {
      favoritesBounds.current = null;
      setFavoritesPlaces([]);
      setIsFavoritesMode(true);
    }
  }, [isFavoritesMode, placeFavoriteIds, exitFavoritesMode]);

  useEffect(() => {
    if (!isFavoritesMode || !mapRef.current?.isReady) return;

    if (favoritesBounds.current) {
      mapRef.current.fitBounds(favoritesBounds.current, {
        padding: 60,
        duration: 800,
        maxZoom: 14,
      });
    } else {
      mapRef.current.flyTo({
        center: FRANCE_VIEW.center,
        zoom: FRANCE_VIEW.zoom,
        duration: 800,
      });
    }
  }, [isFavoritesMode]);

  const handleMarkerClick = (userId: string) => {
    setSelectedItem({ id: userId, type: "creator", eventId: null });
  };

  const handleEventMarkerClick = (
    userId: string,
    eventId: string,
    coordinates: number[]
  ) => {
    exitFavoritesMode();
    setDisplayMode("events");
    setSelectedItem({ id: userId, type: "creator", eventId });
    navigateToPlaceOnMap({
      mapRef,
      placeId: eventId,
      coordinates,
    });
  };

  const handleCloseFilterPanel = useCallback(() => {
    setSelectedItem({ id: "", type: null });
  }, []);

  const handleCloseCreatorCard = useCallback(() => {
    mapRef.current?.setSelectedPlaceId(null);
    setSelectedItem({ id: "", type: null });
  }, []);

  const handleMapBackgroundInteraction = useCallback(() => {
    if (selectedItem.type === "creator") {
      handleCloseCreatorCard();
    }
  }, [selectedItem.type, handleCloseCreatorCard]);

  const handleSelect = (item: SearchResult) => {
    setSelectedItem({ id: item.id, type: item.type, eventId: item.eventId });
    if (item.type === "creator") {
      exitFavoritesMode();
      if (!item.eventId) {
        setFilters({ ...defaultFilters });
      }
    } else if (item.type === null) {
      exitFavoritesMode();
    }
  };

  // Adopte l'URL dans le state uniquement quand searchParams change
  // (navigation, bouton retour), pas à chaque render.
  if (searchParams !== prevSearchParams) {
    setPrevSearchParams(searchParams);
    const urlCreatorId = searchParams.get("creator");
    const urlEventId = searchParams.get("event");
    const currentCreatorId =
      selectedItem.type === "creator" ? selectedItem.id : null;
    const currentEventId =
      selectedItem.type === "creator" ? selectedItem.eventId || null : null;

    if (urlCreatorId !== currentCreatorId || urlEventId !== currentEventId) {
      if (urlCreatorId) {
        setSelectedItem({
          id: urlCreatorId,
          type: "creator",
          eventId: urlEventId,
        });
        if (urlEventId) setDisplayMode("events");
      } else {
        setSelectedItem({ id: "", type: null });
      }
    }
  }

  useEffect(() => {
    const currentCreatorId = searchParams.get("creator");
    const currentEventId = searchParams.get("event");
    const params = new URLSearchParams(searchParams.toString());

    if (selectedItem.type === "creator" && selectedItem.id) {
      const nextEventId = selectedItem.eventId || null;
      if (
        currentCreatorId !== selectedItem.id ||
        currentEventId !== nextEventId
      ) {
        params.set("creator", selectedItem.id);
        if (nextEventId) {
          params.set("event", nextEventId);
        } else {
          params.delete("event");
        }
        const newUrl = `${pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
    } else {
      if (currentCreatorId || currentEventId) {
        params.delete("creator");
        params.delete("event");
        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [selectedItem, pathname, router, searchParams]);

  return (
    <div className={styles.mapPage}>
      <MapFiltersBar
        mapRef={mapRef}
        filters={filters}
        loading={loading}
        selectedItem={selectedItem}
        handleSelect={handleSelect}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        isFavoritesMode={isFavoritesMode}
        onFavoritesModeToggle={handleFavoritesModeToggle}
        onExitFavoritesMode={exitFavoritesMode}
      />
      <div className={styles.mapContainer}>
        {!isResolvingPosition && (
          <MapComponent
            ref={mapRef}
            withPlacesInView
            displayMode={displayMode}
            filters={filters}
            setLoading={setLoading}
            onMarkerClick={handleMarkerClick}
            onEventMarkerClick={handleEventMarkerClick}
            onMapClick={handleMapBackgroundInteraction}
            onMapDragStart={handleMapBackgroundInteraction}
            selectedEventId={selectedItem.eventId}
            height="100%"
            width="100%"
            isFavoritesMode={isFavoritesMode}
            externalPlaces={isFavoritesMode ? favoritesPlaces : undefined}
            viewState={viewState}
            onViewStateChange={onViewStateChange}
            activateGeolocationOnMount
            followUserLocationWhenGeolocating={shouldFollowUserOnGeolocate}
          />
        )}
        {selectedItem.type === "filters" && (
          <MapFiltersPanel
            filters={filters}
            displayMode={displayMode}
            setFilters={setFilters}
            onResetFilters={() => setFilters(defaultFilters)}
            onClose={handleCloseFilterPanel}
          />
        )}
        {selectedItem.type === "creator" && (
          <MapCardContainer
            selectedItem={selectedItem}
            mapRef={mapRef}
            onClose={handleCloseCreatorCard}
            isFavoritesMode={isFavoritesMode}
          />
        )}
      </div>
    </div>
  );
};

export default MapPageContainer;
