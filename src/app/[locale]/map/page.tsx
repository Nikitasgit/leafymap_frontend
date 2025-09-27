"use client";

import MapComponent from "@/components/common/Map/MapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useRef, useEffect } from "react";
import styles from "./mapPage.module.scss";
import FiltersBar from "@/components/map/filtersBar/FiltersBar";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import CardMapContainer from "@/components/map/cardMapContainer/CardMapContainer";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";

const defaultFilters: MapFilters = {
  placeType: "all",
  placeCategories: [],
  startDate: null,
  endDate: null,
};

type SearchResult = {
  id: string;
  type: "place" | "user" | "filters" | null;
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

  const handleSelect = (item: SearchResult) => {
    setSelectedItem({ id: item.id, type: item.type });
    if (item.type !== "filters") {
      setFilters({
        ...defaultFilters,
      });
    }
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
    <div className={styles.mapPage}>
      <FiltersBar
        mapRef={mapRef}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        selectedItem={selectedItem}
        handleSelect={handleSelect}
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
    </div>
  );
};

export default MapPage;
