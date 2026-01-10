import React, { useEffect, useState } from "react";
import MapCreatorCard from "../MapCreatorCard";
import MapFiltersCard from "../MapFiltersCard";
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
      <aside
        className={styles.cardContent}
        role="region"
        aria-live="polite"
        aria-label="Informations de la sélection"
        aria-hidden={isCollapsed}
      >
        {selectedItem.type === "creator" && (
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
      </aside>
    </div>
  );
};

export default MapCardContainer;
