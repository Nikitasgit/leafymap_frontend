import React, { useState } from "react";
import { Marker } from "react-map-gl/mapbox";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon/PlaceCategoryIcon";
import { getPlaceCategoryConfig } from "@/components/common/icons/PlaceCategoryIcon/PlaceCategoryIcon.config";
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
  const categoryConfig = getPlaceCategoryConfig(categoryName);

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
          capitalizeFirstLetter(placeName) || "Lieu"
        } - ${categoryName}`}
        aria-pressed={isSelected}
      >
        <div className={styles.markerIconContainer} aria-hidden="true">
          <PlaceCategoryIcon
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
