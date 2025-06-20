import React from "react";
import { Marker } from "react-map-gl/mapbox";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon";
import styles from "./CategoryMarker.module.scss";

interface CategoryMarkerProps {
  longitude: number;
  latitude: number;
  categoryName: string;
  onClick?: () => void;
  className?: string;
}

const CategoryMarker: React.FC<CategoryMarkerProps> = ({
  longitude,
  latitude,
  categoryName,
  onClick,
  className,
}) => {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
      className={className}
    >
      <div className={styles.markerContainer}>
        <PlaceCategoryIcon
          categoryName={categoryName}
          size="small"
          variant="primary"
          className={styles.markerIcon}
        />
      </div>
    </Marker>
  );
};

export default CategoryMarker;
