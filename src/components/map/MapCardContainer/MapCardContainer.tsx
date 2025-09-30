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
    <aside
      className={`${styles.cardMapContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
      aria-label="Informations de la sélection"
      aria-hidden={isCollapsed}
    >
      <button
        className={styles.collapseButton}
        onClick={toggleCollapse}
        aria-label={
          isCollapsed ? "Ouvrir les informations" : "Fermer les informations"
        }
        aria-expanded={!isCollapsed}
        type="button"
      >
        <span className={styles.desktopText} aria-hidden="true">
          {isCollapsed ? "›" : "‹"}
        </span>
      </button>

      <div className={styles.cardContent} role="region" aria-live="polite">
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
            onClose={() => setIsCollapsed(true)}
          />
        )}
      </div>
    </aside>
  );
};

export default MapCardContainer;
