import React, { useState } from "react";
import { Marker } from "react-map-gl/mapbox";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon";
import styles from "./CategoryMarker.module.scss";

interface CategoryMarkerProps {
  longitude: number;
  latitude: number;
  categoryName: string;
  placeName?: string;
  onClick?: () => void;
  className?: string;
  zoom?: number;
}

const CategoryMarker: React.FC<CategoryMarkerProps> = ({
  longitude,
  latitude,
  categoryName,
  placeName,
  onClick,
  className,
  zoom = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isZoomedIn = zoom >= 15;
  const shouldShowLabel = isZoomedIn || isHovered;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
      className={className}
    >
      <div
        className={styles.markerContainer}
        onMouseEnter={() => !isZoomedIn && setIsHovered(true)}
        onMouseLeave={() => !isZoomedIn && setIsHovered(false)}
      >
        <PlaceCategoryIcon
          categoryName={categoryName}
          size="small"
          variant="primary"
          className={styles.markerIcon}
        />
        {placeName && shouldShowLabel && (
          <div
            className={`${styles.placeLabel} ${
              isZoomedIn ? styles.permanent : styles.hover
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
