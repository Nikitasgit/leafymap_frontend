import React, { useState } from "react";
import { Marker } from "react-map-gl/mapbox";
import PlaceCategoryIcon, {
  getPlaceCategoryConfig,
} from "@/shared/ui/icons/placeCategoryIcon";
import EventCategoryIcon, {
  getEventCategoryConfig,
} from "@/shared/ui/icons/eventCategoryIcon";
import styles from "./CategoryMarker.module.scss";
import { CategoryMarkerProps } from "./CategoryMarker.types";
import { capitalizeFirstLetter } from "@/shared/utils/functions";

const CategoryMarker: React.FC<CategoryMarkerProps> = ({
  longitude,
  latitude,
  categoryName,
  categoryKind = "place",
  placeName,
  onClick,
  zoom = 0,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isZoomedIn = zoom >= 15;
  const isZoomHighEnough = zoom >= 10;
  const shouldShowLabel =
    isZoomHighEnough && (isZoomedIn || isHovered || isSelected);
  const isEvent = categoryKind === "event";
  const categoryConfig = isEvent
    ? getEventCategoryConfig(categoryName)
    : getPlaceCategoryConfig(categoryName);
  const CategoryIcon = isEvent ? EventCategoryIcon : PlaceCategoryIcon;
  const labelFallback = isEvent ? "Événement" : "Lieu";

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={(event) => {
        // The marker sits in the map canvas container, so this click also
        // bubbles to the map. Stop it here so selecting a pin is not treated
        // as a background click that closes the card.
        event.originalEvent.stopPropagation();
        onClick?.();
      }}
      className={`${styles.markerContainer} ${
        isSelected ? styles.selected : ""
      }`}
    >
      <button
        className={styles.marker}
        style={
          {
            "--marker-color": categoryConfig.color,
            "--marker-shadow": `${categoryConfig.color}4D`,
          } as React.CSSProperties
        }
        onMouseEnter={() => !isZoomedIn && setIsHovered(true)}
        onMouseLeave={() => !isZoomedIn && setIsHovered(false)}
        type="button"
        aria-label={`${
          capitalizeFirstLetter(placeName) || labelFallback
        } - ${categoryName}`}
        aria-pressed={isSelected}
      >
        <div className={styles.markerIconContainer} aria-hidden="true">
          <CategoryIcon
            categoryName={categoryName}
            size="small"
            iconColor="#ffffff"
            className={`${styles.markerIcon} ${
              isSelected ? styles.selectedIcon : ""
            }`}
          />
        </div>
        {placeName && shouldShowLabel && (
          <span
            className={`${styles.placeLabel} ${
              isSelected ? styles.selected : ""
            }`}
            aria-hidden="true"
          >
            {capitalizeFirstLetter(placeName)}
          </span>
        )}
      </button>
    </Marker>
  );
};

export default CategoryMarker;
