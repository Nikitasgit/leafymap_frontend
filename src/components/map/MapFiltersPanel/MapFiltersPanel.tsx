import { useState, useCallback, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
        isMobile={isMobile}
      />
    </div>
  );
};

export default MapFiltersPanel;
