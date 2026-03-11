import React from "react";
import { getPlaceCategoryConfig } from "./PlaceCategoryIcon.config";
import styles from "./PlaceCategoryIcon.module.scss";

interface PlaceCategoryIconProps {
  categoryName: string;
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "primary" | "secondary" | "success" | "error" | "grey";
  hoverable?: boolean;
  className?: string;
  colorByCategory?: boolean;
}

const PlaceCategoryIcon: React.FC<PlaceCategoryIconProps> = ({
  categoryName,
  size = "medium",
  variant = "primary",
  hoverable = false,
  className = "",
  colorByCategory = false,
}) => {
  const config = getPlaceCategoryConfig(categoryName);
  const IconComponent = config.icon;

  const iconClasses = [
    styles.placeCategoryIcon,
    styles[size],
    !colorByCategory && styles[variant],
    hoverable && styles.hoverable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = colorByCategory ? { color: config.color } : undefined;

  return (
    <span className={iconClasses} style={style}>
      <IconComponent />
    </span>
  );
};

export default PlaceCategoryIcon;
