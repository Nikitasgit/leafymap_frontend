import { useState, useCallback } from "react";
import MapFiltersCard from "../MapFiltersCard";
import styles from "./MapFiltersPanel.module.scss";
import { MapFiltersPanelProps } from "./MapFiltersPanel.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MapFiltersPanel = ({
  filters,
  displayMode,
  setFilters,
  onResetFilters,
  onClose,
}: MapFiltersPanelProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

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
        displayMode={displayMode}
        onFiltersChange={setFilters}
        onResetFilters={onResetFilters}
        onClose={handleClose}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MapFiltersPanel;
