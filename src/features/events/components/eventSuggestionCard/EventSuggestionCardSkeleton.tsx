import Skeleton from "@mui/material/Skeleton";
import styles from "./EventSuggestionCardSkeleton.module.scss";

const EventSuggestionCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton
        variant="rectangular"
        className={styles.skeletonDateBanner}
        animation="wave"
      />
      <div className={styles.skeletonImageWrap}>
        <Skeleton
          variant="rectangular"
          className={styles.skeletonImage}
          animation="wave"
        />
      </div>
    </div>
  );
};

export default EventSuggestionCardSkeleton;
