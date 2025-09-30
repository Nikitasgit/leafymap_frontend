import React, { useEffect, useState } from "react";
import MapPlaceCard from "../MapPlaceCard";
import MapFiltersCard from "../MapFiltersCard";
import MapCreatorCard from "../MapCreatorCard";
import styles from "./MapCardContainer.module.scss";
import { MapCardContainerProps } from "./MapCardContainer.types";

const MapCardContainer = ({
  selectedItem,
  mapRef,
  filters,
  setFilters,
  onResetFilters,
}: MapCardContainerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  useEffect(() => {
    setIsCollapsed(false);
  }, [selectedItem]);

  return (
    <div
      className={`${styles.cardMapContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      <button
        className={styles.collapseButton}
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand card" : "Collapse card"}
      >
        {isCollapsed ? "›" : "‹"}
      </button>

      <div className={styles.cardContent}>
        {selectedItem.type === "place" && (
          <MapPlaceCard placeId={selectedItem.id} mapRef={mapRef} />
        )}
        {selectedItem.type === "user" && (
          <MapCreatorCard userId={selectedItem.id} mapRef={mapRef} />
        )}
        {selectedItem.type === "filters" && (
          <MapFiltersCard
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={onResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default MapCardContainer;
