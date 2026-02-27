import React, { useCallback, useEffect, useRef, useState } from "react";
import MapCreatorCard from "../MapCreatorCard";
import MapFiltersCard from "../MapFiltersCard";
import styles from "./MapCardContainer.module.scss";
import { MapCardContainerProps } from "./MapCardContainer.types";

type DrawerState = "collapsed" | "default" | "expanded";

const NAVBAR_HEIGHT_PX = 60;

const MapCardContainer = ({
  selectedItem,
  mapRef,
  filters,
  setFilters,
  onResetFilters,
}: MapCardContainerProps) => {
  const [drawerState, setDrawerState] = useState<DrawerState>("default");
  const [dragTranslateY, setDragTranslateY] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartTranslateY = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const isCollapsed = drawerState === "collapsed";

  const toggleCollapse = useCallback(() => {
    setDrawerState((prev) =>
      prev === "collapsed" ? "default" : prev === "expanded" ? "default" : "collapsed",
    );
  }, []);

  useEffect(() => {
    setDrawerState("default");
  }, [selectedItem]);

  const getSnapState = useCallback(
    (translateY: number, height: number): DrawerState => {
      const expandedThreshold = NAVBAR_HEIGHT_PX;
      const collapsedThreshold = height - 20;
      const defaultThreshold = height * 0.35;
      const toExpanded = Math.abs(translateY - expandedThreshold);
      const toDefault = Math.abs(translateY - defaultThreshold);
      const toCollapsed = Math.abs(translateY - collapsedThreshold);
      if (toExpanded <= toDefault && toExpanded <= toCollapsed) return "expanded";
      if (toDefault <= toCollapsed) return "default";
      return "collapsed";
    },
    [],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const height = container.getBoundingClientRect().height;
      const baseY =
        drawerState === "expanded"
          ? NAVBAR_HEIGHT_PX
          : drawerState === "default"
            ? height * 0.35
            : height - 20;
      touchStartY.current = e.touches[0].clientY;
      touchStartTranslateY.current = dragTranslateY ?? baseY;
    },
    [drawerState, dragTranslateY],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;
      e.preventDefault();
      const height = container.getBoundingClientRect().height;
      const deltaY = e.touches[0].clientY - touchStartY.current;
      let nextY = touchStartTranslateY.current + deltaY;
      nextY = Math.max(NAVBAR_HEIGHT_PX, Math.min(height - 20, nextY));
      setDragTranslateY(nextY);
    },
    [],
  );

  const handleTouchEnd = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const height = container.getBoundingClientRect().height;
    const currentY = dragTranslateY ?? (drawerState === "expanded" ? NAVBAR_HEIGHT_PX : drawerState === "default" ? height * 0.35 : height - 20);
    setDrawerState(getSnapState(currentY, height));
    setDragTranslateY(null);
  }, [dragTranslateY, drawerState, getSnapState]);

  const isDragging = dragTranslateY !== null;
  const mobileTransform =
    isMobile && isDragging && dragTranslateY !== null
      ? `translateY(${dragTranslateY}px)`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`${styles.cardMapContainer} ${styles[`state_${drawerState}`]}`}
      data-state={drawerState}
      data-dragging={isDragging}
      style={mobileTransform ? { transform: mobileTransform } : undefined}
    >
      <button
        className={styles.collapseButton}
        onClick={toggleCollapse}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
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
            onClose={() => setDrawerState("collapsed")}
          />
        )}
      </aside>
    </div>
  );
};

export default MapCardContainer;
