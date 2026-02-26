import Skeleton from "@mui/material/Skeleton";
import styles from "./UserSuggestionCardSkeleton.module.scss";

const UserSuggestionCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImageWrap}>
        <Skeleton
          variant="rectangular"
          className={styles.skeletonImage}
          animation="wave"
        />
      </div>
      <div className={styles.skeletonContent}>
        <Skeleton variant="text" width="80%" height={20} animation="wave" />
        <Skeleton variant="text" width="60%" height={14} animation="wave" />
        <Skeleton variant="text" width="90%" height={14} animation="wave" />
      </div>
    </div>
  );
};

export default UserSuggestionCardSkeleton;
