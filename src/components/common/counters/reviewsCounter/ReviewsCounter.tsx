import { Star } from "lucide-react";
import React from "react";
import styles from "./ReviewsCounter.module.scss";

const ReviewsCounter = ({ rating }: { rating: number }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${styles.star} ${
          index < rating ? styles.filled : styles.empty
        }`}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };
  return (
    <div className={styles.reviewsCounter}>
      <span className={styles.counter}>{rating || 0}</span>
      <div className={styles.starsContainer}>{renderStars(rating || 0)}</div>
    </div>
  );
};

export default ReviewsCounter;
