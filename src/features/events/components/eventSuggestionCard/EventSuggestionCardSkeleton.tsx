import styles from "./EventSuggestionCardSkeleton.module.scss";

const EventSuggestionCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonDateBanner} />
      <div className={styles.skeletonImageWrap}>
        <div className={styles.skeletonImage} />
      </div>
    </div>
  );
};

export default EventSuggestionCardSkeleton;
