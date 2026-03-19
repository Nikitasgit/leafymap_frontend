import React, { useCallback, useEffect, useRef, useState } from "react";
import MapCreatorCard from "../MapCreatorCard";
import styles from "./MapCardContainer.module.scss";
import { MapCardContainerProps } from "./MapCardContainer.types";

type DrawerState = "collapsed" | "default" | "expanded";

const COLLAPSED_HEIGHT_PX = 40;
const SNAP_COLLAPSED = 0.2;
const SNAP_EXPANDED = 0.55;

const MapCardContainer = ({
  selectedItem,
  mapRef,
  isFavoritesMode = false,
}: MapCardContainerProps) => {
  const [drawerState, setDrawerState] = useState<DrawerState>("default");
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartHeight = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const isCollapsed = drawerState === "collapsed";

  const toggleCollapse = useCallback(() => {
    setDrawerState((prev) => (prev === "collapsed" ? "default" : "collapsed"));
  }, []);

  useEffect(() => {
    setDrawerState("default");
  }, [selectedItem]);

  const getContainerHeight = useCallback(() => {
    return containerRef.current?.parentElement?.getBoundingClientRect().height ?? window.innerHeight;
  }, []);

  const getHeightForState = useCallback(
    (state: DrawerState): number => {
      const total = getContainerHeight();
      switch (state) {
        case "collapsed":
          return COLLAPSED_HEIGHT_PX;
        case "default":
          return total * 0.65;
        case "expanded":
          return total;
      }
    },
    [getContainerHeight]
  );

  const snapToState = useCallback(
    (height: number): DrawerState => {
      const total = getContainerHeight();
      const ratio = height / total;
      if (ratio < SNAP_COLLAPSED) return "collapsed";
      if (ratio < SNAP_EXPANDED) return "default";
      return "expanded";
    },
    [getContainerHeight]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartHeight.current = dragHeight ?? getHeightForState(drawerState);
    },
    [drawerState, dragHeight, getHeightForState]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const total = getContainerHeight();
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const nextHeight = Math.max(
        COLLAPSED_HEIGHT_PX,
        Math.min(total, touchStartHeight.current + deltaY)
      );
      setDragHeight(nextHeight);
    },
    [getContainerHeight]
  );

  const handleTouchEnd = useCallback(() => {
    const currentHeight = dragHeight ?? getHeightForState(drawerState);
    setDrawerState(snapToState(currentHeight));
    setDragHeight(null);
  }, [dragHeight, drawerState, getHeightForState, snapToState]);

  const isDragging = dragHeight !== null;
  const mobileHeight = isMobile && isDragging ? `${dragHeight}px` : undefined;

  return (
    <div
      ref={containerRef}
      className={`${styles.cardMapContainer} ${styles[`state_${drawerState}`]}`}
      data-state={drawerState}
      data-dragging={isDragging}
      data-creator-loading={isCreatorLoading ? "true" : undefined}
      style={mobileHeight ? { height: mobileHeight } : undefined}
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
        <MapCreatorCard
          userId={selectedItem.id}
          mapRef={mapRef}
          skipFetchPlacesInView={isFavoritesMode}
          onLoadingChange={setIsCreatorLoading}
        />
      </aside>
    </div>
  );
};

export default MapCardContainer;
