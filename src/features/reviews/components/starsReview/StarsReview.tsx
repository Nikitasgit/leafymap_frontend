"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import styles from "./StarsReview.module.scss";

interface StarsReviewProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "small" | "medium" | "large";
}

const StarsReview: React.FC<StarsReviewProps> = ({
  rating,
  onRatingChange,
  size = "medium",
}) => {
  const { t } = useTranslation("common");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const displayRating = hoveredRating ?? rating;

  const handleStarClick = (starNumber: number) => {
    onRatingChange(starNumber);
  };

  const handleMouseEnter = (starNumber: number) => {
    setHoveredRating(starNumber);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  return (
    <div
      className={`${styles.starsContainer} ${styles[size]}`}
      role="radiogroup"
      aria-label={t("starsReview.ariaLabel")}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <button
          key={starNumber}
          type="button"
          className={styles.starButton}
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleMouseEnter(starNumber)}
          aria-label={t("starsReview.starAriaLabel", { count: starNumber })}
        >
          <Star
            className={styles.star}
            fill={starNumber <= displayRating ? "#ff9500" : "none"}
            stroke="#ff9500"
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

export default StarsReview;
