"use client";

import MapComponent from "@/components/common/Map/MapComponent/Map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useRef, useEffect } from "react";
import styles from "./MapPageContainer.module.scss";
import MapFiltersBar from "@/components/map/MapFiltersBar";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import MapCardContainer from "@/components/map/MapCardContainer";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";
import { SearchResult } from "./MapPageContainer.types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const defaultFilters: MapFilters = {
  placeType: "all",
  placeCategories: [],
  startDate: null,
  endDate: null,
};

const MapPageContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCreatorId = searchParams.get("creator");
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: "creator" | "filters" | null;
  }>(
    initialCreatorId
      ? { id: initialCreatorId, type: "creator" }
      : { id: "", type: null }
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MapFilters>(defaultFilters);
  const mapRef = useRef<ExtendedMapRef | null>(null);
  const isUpdatingFromUrl = useRef(false);
  const placeCategoriesIds = useAppSelector(selectPlaceCategories).map(
    (category) => category._id
  );

  const handleMarkerClick = (userId: string) => {
    setSelectedItem({ id: userId, type: "creator" });
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

  useEffect(() => {
    const urlCreatorId = searchParams.get("creator");
    const currentCreatorId =
      selectedItem.type === "creator" ? selectedItem.id : null;
    if (urlCreatorId !== currentCreatorId) {
      isUpdatingFromUrl.current = true;
      if (urlCreatorId) {
        setSelectedItem({ id: urlCreatorId, type: "creator" });
      } else {
        setSelectedItem({ id: "", type: null });
      }
      setTimeout(() => {
        isUpdatingFromUrl.current = false;
      }, 0);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      return;
    }
    const currentCreatorId = searchParams.get("creator");
    const params = new URLSearchParams(searchParams.toString());

    if (selectedItem.type === "creator" && selectedItem.id) {
      if (currentCreatorId !== selectedItem.id) {
        params.set("creator", selectedItem.id);
        const newUrl = `${pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
    } else {
      if (currentCreatorId) {
        params.delete("creator");
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
          <MapCardContainer
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

export default MapPageContainer;
