"use client";

import MapComponent from "@/components/map/mapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useRef, useEffect } from "react";
import styles from "./mapPage.module.scss";
import FiltersBar from "@/components/map/filtersBar/FiltersBar";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import { Collaborator } from "@/types/place/collaborators";
import { Place } from "@/types/place";
import CardMapContainer from "@/components/map/cardMapContainer/CardMapContainer";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";

const defaultFilters: MapFilters = {
  placeType: "all",
  placeCategories: [],
  startDate: null,
  endDate: null,
};

const MapPage = () => {
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: "place" | "user" | "filters" | null;
  }>({ id: "", type: null });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const mapRef = useRef<ExtendedMapRef | null>(null);
  const placeCategoriesIds = useAppSelector(selectPlaceCategories).map(
    (category) => category._id
  );

  const handleMarkerClick = (placeId: string) => {
    setSelectedItem({ id: placeId, type: "place" });
  };

  const handleUserSelect = (user: Collaborator) => {
    setSelectedItem({ id: user._id, type: "user" });
    setFilters({
      ...defaultFilters,
    });
  };

  const handlePlaceSelect = (
    place: Pick<Place, "_id" | "location" | "image" | "name" | "placeCategory">
  ) => {
    setSelectedItem({ id: place._id, type: "place" });
    setFilters({
      ...defaultFilters,
    });
  };
  const handleOpenFilters = () => {
    setSelectedItem({ id: "", type: "filters" });
  };

  useEffect(() => {
    if (filters.placeCategories.length === 0) {
      const allCategoryIds = placeCategoriesIds;
      setFilters((prev) => ({
        ...prev,
        placeCategories: allCategoryIds,
      }));
    }
  }, [placeCategoriesIds, filters.placeCategories]);

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
        {selectedItem.type && (
          <CardMapContainer
            selectedItem={selectedItem}
            mapRef={mapRef}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={() => setFilters(defaultFilters)}
          />
        )}
      </div>
    </main>
  );
};

export default MapPage;
