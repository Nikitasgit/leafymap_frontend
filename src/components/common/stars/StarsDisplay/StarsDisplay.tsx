import React from "react";
import { Star } from "lucide-react";
import styles from "./StarsDisplay.module.scss";

interface StarsDisplayProps {
  rating: number;
  size?: "small" | "medium" | "large";
}

const StarsDisplay: React.FC<StarsDisplayProps> = ({
  rating,
  size = "medium",
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className={`${styles.starsContainer} ${styles[size]}`}
      role="img"
      aria-label={`${rating} sur 5 étoiles`}
    >
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          className={styles.star}
          fill="#ff9500"
          stroke="#ff9500"
          strokeWidth={1.5}
        />
      ))}
      {hasHalfStar && (
        <div className={styles.halfStar} key="half">
          {/* Stroke complet pour le contour */}
          <Star
            className={`${styles.star} ${styles.halfStarStroke}`}
            fill="none"
            stroke="#ff9500"
            strokeWidth={1.5}
          />
          {/* Fill pour la moitié gauche seulement */}
          <Star
            className={`${styles.star} ${styles.halfStarFill}`}
            fill="#ff9500"
            stroke="none"
            strokeWidth={0}
          />
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          className={styles.star}
          stroke="#ff9500"
          fill="none"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export default StarsDisplay;
