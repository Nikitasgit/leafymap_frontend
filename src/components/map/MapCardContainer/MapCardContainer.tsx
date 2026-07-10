import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import MapCreatorCard from "../MapCreatorCard";
import styles from "./MapCardContainer.module.scss";
import { MapCardContainerProps } from "./MapCardContainer.types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type DrawerState = "collapsed" | "default" | "expanded";

const COLLAPSED_HEIGHT_PX = 40;
const SNAP_COLLAPSED = 0.2;
const SNAP_EXPANDED = 0.55;
/** Doit rester aligné avec `transition` dans MapCardContainer.module.scss (0.3s + marge). */
const CLOSE_TRANSITION_FALLBACK_MS = 400;

const MapCardContainer = ({
  selectedItem,
  mapRef,
  onClose,
  isFavoritesMode = false,
}: MapCardContainerProps) => {
  const { t } = useTranslation("map");
  const [drawerState, setDrawerState] = useState<DrawerState>("default");
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isCreatorLoading, setIsCreatorLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartHeight = useRef(0);
  const touchDraggedRef = useRef(false);
  const [isAnimatingClose, setIsAnimatingClose] = useState(false);
  const [closeFallbackTimerId, setCloseFallbackTimerId] = useState<number | null>(
    null,
  );
  const [prevSelectedItem, setPrevSelectedItem] = useState(selectedItem);

  const clearCloseFallback = useCallback(() => {
    setCloseFallbackTimerId((currentId) => {
      if (currentId !== null) {
        window.clearTimeout(currentId);
      }
      return null;
    });
  }, []);

  const finishCloseAfterAnimation = useCallback(() => {
    if (!isAnimatingClose) {
      return;
    }
    setIsAnimatingClose(false);
    clearCloseFallback();
    onClose();
  }, [clearCloseFallback, isAnimatingClose, onClose]);

  if (selectedItem !== prevSelectedItem) {
    setPrevSelectedItem(selectedItem);
    setIsAnimatingClose(false);
    if (closeFallbackTimerId !== null) {
      window.clearTimeout(closeFallbackTimerId);
      setCloseFallbackTimerId(null);
    }
    setDrawerState("default");
  }

  useEffect(
    () => () => {
      clearCloseFallback();
    },
    [clearCloseFallback],
  );

  const isCollapsed = drawerState === "collapsed";

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
      touchDraggedRef.current = false;
      touchStartY.current = e.touches[0].clientY;
      touchStartHeight.current = dragHeight ?? getHeightForState(drawerState);
    },
    [drawerState, dragHeight, getHeightForState]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const deltaFromStart = Math.abs(
        touchStartY.current - e.touches[0].clientY
      );
      if (deltaFromStart > 8) {
        touchDraggedRef.current = true;
      }
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

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (!isAnimatingClose) {
        return;
      }
      if (e.target !== e.currentTarget) {
        return;
      }
      if (e.propertyName !== "height" && e.propertyName !== "transform") {
        return;
      }
      finishCloseAfterAnimation();
    },
    [finishCloseAfterAnimation, isAnimatingClose],
  );

  const handleHandleClick = useCallback(() => {
    if (touchDraggedRef.current) {
      touchDraggedRef.current = false;
      return;
    }
    if (isAnimatingClose) {
      return;
    }
    if (drawerState === "collapsed") {
      onClose();
      return;
    }
    setIsAnimatingClose(true);
    setDrawerState("collapsed");
    clearCloseFallback();
    const timerId = window.setTimeout(() => {
      setCloseFallbackTimerId(null);
      finishCloseAfterAnimation();
    }, CLOSE_TRANSITION_FALLBACK_MS);
    setCloseFallbackTimerId(timerId);
  }, [
    clearCloseFallback,
    drawerState,
    finishCloseAfterAnimation,
    isAnimatingClose,
    onClose,
  ]);

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
      onTransitionEnd={handleTransitionEnd}
    >
      <button
        className={styles.collapseButton}
        onClick={handleHandleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        aria-label={t("mapCardContainer.closeCreatorCardAriaLabel")}
        type="button"
      >
        <span className={styles.desktopText} aria-hidden="true">
          ‹
        </span>
      </button>
      <aside
        className={styles.cardContent}
        role="region"
        aria-live="polite"
        aria-label={t("mapCardContainer.selectionInfoAriaLabel")}
        aria-hidden={isCollapsed}
      >
        <MapCreatorCard
          userId={selectedItem.id}
          initialEventId={selectedItem.eventId}
          mapRef={mapRef}
          skipFetchPlacesInView={isFavoritesMode}
          onLoadingChange={setIsCreatorLoading}
        />
      </aside>
    </div>
  );
};

export default MapCardContainer;
