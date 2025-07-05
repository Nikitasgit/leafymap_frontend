"use client";

import MapComponent from "@/components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useRef } from "react";
import PlaceCardMap from "@/components/map/placeCardMap/PlaceCardMap";
import styles from "./mapPage.module.scss";
import FiltersBar from "@/components/map/filtersBar/FiltersBar";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import { Collaborator } from "@/types/place/collaborators";
import UserCardMap from "@/components/map/userCardMap/UserCardMap";
import mapboxgl from "mapbox-gl";
import { applyPixelOffsetToLocation } from "@/utils/map";
import FiltersCardMap from "@/components/map/filtersCardMap/FiltersCardMap";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";

const defaultFilters: MapFilters = {
  placeType: "all",
  placeCategories: [],
  startDate: null,
  endDate: null,
};

const MapPage = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const mapRef = useRef<ExtendedMapRef>(null);
  const isSelectingFromSearch = useRef(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const placeCategories = useAppSelector(selectPlaceCategories);

  useEffect(() => {
    if (placeCategories.length > 0 && filters.placeCategories.length === 0) {
      const allCategoryIds = placeCategories.map((category) => category._id);
      setFilters((prev) => ({
        ...prev,
        placeCategories: allCategoryIds,
      }));
    }
  }, [placeCategories, filters.placeCategories.length]);

  useEffect(() => {
    if (selectedPlace && !isSelectingFromSearch.current) {
      setSelectedPlace(null);
    }
    isSelectingFromSearch.current = false;
  }, [filters]);

  const handleMarkerClick = (placeId: string) => {
    setSelectedPlace(placeId);
    setSelectedUser(null);
    setIsFiltersOpen(false);
  };

  const handleUserSelect = (user: Collaborator) => {
    setSelectedUser(user);
    setIsFiltersOpen(false);
    if (mapRef.current) {
      mapRef.current.setSelectedPlaceId(null);
    }
    setFilters({
      ...defaultFilters,
    });
    setSelectedPlace(null);
  };

  const handlePlaceSelect = (place: {
    _id: string;
    location: { coordinates: number[] };
  }) => {
    isSelectingFromSearch.current = true;
    setSelectedPlace(place._id);
    setFilters({
      ...defaultFilters,
    });
    setSelectedUser(null);
    setIsFiltersOpen(false);
    if (mapRef.current) {
      mapRef.current.setSelectedPlaceId(place._id);
      const [longitude, latitude] = place.location.coordinates;
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([longitude - 0.01, latitude - 0.01]);
      bounds.extend([longitude + 0.01, latitude + 0.01]);

      mapRef.current?.fetchPlacesInView(bounds);
      const offsetLocation = applyPixelOffsetToLocation(
        { latitude, longitude },
        -100,
        0
      );

      mapRef.current?.flyTo({
        center: [offsetLocation.longitude, offsetLocation.latitude],
        zoom: 15,
        duration: 800,
      });
    }
  };
  const handleOpenFilters = () => {
    setSelectedUser(null);
    setSelectedPlace(null);
    if (mapRef.current) {
      mapRef.current.setSelectedPlaceId(null);
    }
    setIsFiltersOpen(true);
  };
  return (
    <main className={styles.mapPage}>
      <FiltersBar
        mapRef={mapRef}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        handleUserSelect={handleUserSelect}
        handlePlaceSelect={handlePlaceSelect}
        handleOpenFilters={handleOpenFilters}
      />
      <div className={styles.mapContainer}>
        <MapComponent
          ref={mapRef}
          withPlacesInView
          filters={filters}
          setLoading={setLoading}
          onMarkerClick={handleMarkerClick}
          height="100%"
          width="100%"
        />
        {selectedPlace && <PlaceCardMap placeId={selectedPlace} />}
        {selectedUser && <UserCardMap user={selectedUser} mapRef={mapRef} />}
        {isFiltersOpen && (
          <FiltersCardMap
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={() => setFilters(defaultFilters)}
          />
        )}
      </div>
    </main>
  );
};

export default MapPage;
