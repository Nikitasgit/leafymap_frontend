import React from "react";
import styles from "./LoadingBar.module.scss";

const LoadingBar: React.FC = () => {
  return (
    <div className={styles.loadingBarContainer}>
      <div className={styles.loadingBar} />
    </div>
  );
};

export default LoadingBar;
