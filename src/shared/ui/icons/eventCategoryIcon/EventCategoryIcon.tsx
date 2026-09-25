import React from "react";
import { getEventCategoryConfig } from "./EventCategoryIcon.config";
import styles from "../placeCategoryIcon/PlaceCategoryIcon.module.scss";

interface EventCategoryIconProps {
  categoryName: string;
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "primary" | "secondary" | "success" | "error" | "grey";
  hoverable?: boolean;
  className?: string;
  colorByCategory?: boolean;
  /** When set, overrides color from category or variant */
  iconColor?: string;
}

const EventCategoryIcon: React.FC<EventCategoryIconProps> = ({
  categoryName,
  size = "medium",
  variant = "primary",
  hoverable = false,
  className = "",
  colorByCategory = false,
  iconColor,
}) => {
  const config = getEventCategoryConfig(categoryName);
  const IconComponent = config.icon;

  const iconClasses = [
    styles.placeCategoryIcon,
    styles[size],
    !colorByCategory && !iconColor && styles[variant],
    hoverable && styles.hoverable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = iconColor
    ? { color: iconColor }
    : colorByCategory
      ? { color: config.color }
      : undefined;

  return (
    <span className={iconClasses} style={style}>
      <IconComponent />
    </span>
  );
};

export default EventCategoryIcon;
