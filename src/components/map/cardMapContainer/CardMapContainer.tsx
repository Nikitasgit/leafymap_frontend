import { ExtendedMapRef, MapFilters } from "@/types/map";
import React, { useEffect, useState } from "react";
import PlaceCardMap from "../placeCardMap/PlaceCardMap";
import FiltersCardMap from "../filtersCardMap/FiltersCardMap";
import UserCardMap from "../userCardMap/UserCardMap";
import styles from "./CardMapContainer.module.scss";

const CardMapContainer = ({
  selectedItem,
  mapRef,
  filters,
  setFilters,
  onResetFilters,
}: {
  selectedItem: { id: string; type: "place" | "user" | "filters" | null };
  mapRef: React.RefObject<ExtendedMapRef | null>;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  onResetFilters: () => void;
}) => {
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
          <PlaceCardMap placeId={selectedItem.id} mapRef={mapRef} />
        )}
        {selectedItem.type === "user" && (
          <UserCardMap userId={selectedItem.id} mapRef={mapRef} />
        )}
        {selectedItem.type === "filters" && (
          <FiltersCardMap
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={onResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default CardMapContainer;
