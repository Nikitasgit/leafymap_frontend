import React, { useState } from "react";
import { Marker } from "react-map-gl/mapbox";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon";
import styles from "./CategoryMarker.module.scss";

export interface CategoryMarkerProps {
  longitude: number;
  latitude: number;
  categoryName: string;
  placeName?: string;
  onClick?: () => void;
  zoom?: number;
  isSelected?: boolean;
}

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
      <div
        className={styles.marker}
        onMouseEnter={() => !isZoomedIn && setIsHovered(true)}
        onMouseLeave={() => !isZoomedIn && setIsHovered(false)}
      >
        <div className={styles.markerIconContainer}>
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
          <div
            className={`${styles.placeLabel} ${
              isSelected ? styles.selected : ""
            }`}
          >
            {placeName}
          </div>
        )}
      </div>
    </Marker>
  );
};

export default CategoryMarker;
