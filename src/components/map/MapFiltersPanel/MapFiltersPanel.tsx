import { useState, useCallback } from "react";
import MapFiltersCard from "../MapFiltersCard";
import styles from "./MapFiltersPanel.module.scss";
import { MapFiltersPanelProps } from "./MapFiltersPanel.types";

const MapFiltersPanel = ({
  filters,
  setFilters,
  onResetFilters,
  onClose,
}: MapFiltersPanelProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (isClosing) onClose();
  }, [isClosing, onClose]);

  return (
    <div
      className={`${styles.filtersPanel} ${isClosing ? styles.closing : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <MapFiltersCard
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={onResetFilters}
        onClose={handleClose}
      />
    </div>
  );
};

export default MapFiltersPanel;
