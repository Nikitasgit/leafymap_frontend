import React from "react";
import {
  MapPin,
  ShoppingBag,
  Palette,
  Image as ImageIcon,
  Hammer,
  Sprout,
  Store,
  Calendar,
  Users,
  LucideIcon,
} from "lucide-react";
import styles from "./PlaceCategoryIcon.module.scss";

interface PlaceCategoryIconProps {
  categoryName: string;
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "primary" | "secondary" | "success" | "error" | "grey";
  hoverable?: boolean;
  className?: string;
}

const PlaceCategoryIcon: React.FC<PlaceCategoryIconProps> = ({
  categoryName,
  size = "medium",
  variant = "primary",
  hoverable = false,
  className = "",
}) => {
  
  const getCategoryIcon = (name: string): LucideIcon => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("food market")) {
      return ShoppingBag;
    }

    if (lowerName.includes("craft fair")) {
      return Palette;
    }

    if (lowerName.includes("gallery")) {
      return ImageIcon;
    }

    if (lowerName.includes("workshop")) {
      return Hammer;
    }

    if (lowerName.includes("farm")) {
      return Sprout;
    }

    if (lowerName.includes("boutique")) {
      return Store;
    }

    if (lowerName.includes("cooperative store")) {
      return Users;
    }

    if (lowerName.includes("festival")) {
      return Calendar;
    }

    return MapPin;
  };

  const IconComponent = getCategoryIcon(categoryName);

  const iconClasses = [
    styles.placeCategoryIcon,
    styles[size],
    styles[variant],
    hoverable && styles.hoverable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={iconClasses}>
      <IconComponent />
    </span>
  );
};

export default PlaceCategoryIcon;
