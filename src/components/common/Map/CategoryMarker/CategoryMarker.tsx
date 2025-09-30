import React, { useState } from "react";
import { Marker } from "react-map-gl/mapbox";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon/PlaceCategoryIcon";
import styles from "./CategoryMarker.module.scss";
import { CategoryMarkerProps } from "./CategoryMarker.types";
import { capitalizeFirstLetter } from "@/utils/functions";

const CategoryMarker: React.FC<CategoryMarkerProps> = ({
  longitude,
  latitude,
  categoryName,
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

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
      className={`${styles.markerContainer} ${
        isSelected ? styles.selected : ""
      }`}
    >
      <button
        className={styles.marker}
        onMouseEnter={() => !isZoomedIn && setIsHovered(true)}
        onMouseLeave={() => !isZoomedIn && setIsHovered(false)}
        type="button"
        aria-label={`${
          capitalizeFirstLetter(placeName) || "Lieu"
        } - ${categoryName}`}
        aria-pressed={isSelected}
      >
        <div className={styles.markerIconContainer} aria-hidden="true">
          <PlaceCategoryIcon
            categoryName={categoryName}
            size="small"
            variant={isSelected ? "secondary" : "primary"}
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
