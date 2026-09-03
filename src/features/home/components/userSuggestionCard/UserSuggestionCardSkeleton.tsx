import styles from "./UserSuggestionCardSkeleton.module.scss";

const UserSuggestionCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonImageWrap}>
        <div className={styles.skeletonImage} />
      </div>
      <div className={styles.skeletonContent}>
        <div className={`${styles.bone} ${styles.lineTitle}`} />
        <div className={`${styles.bone} ${styles.lineMedium}`} />
        <div className={`${styles.bone} ${styles.lineWide}`} />
      </div>
    </div>
  );
};

export default UserSuggestionCardSkeleton;
