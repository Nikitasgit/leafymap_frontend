import React from "react";
import styles from "./LoadingBar.module.scss";

const LoadingBar: React.FC = () => {
  return (
    <div className={styles.loadingBarContainer}>
      <div
        className={styles.loadingBar}
        style={
          {
            "--loading-height": "4px",
            "--loading-color": "#007AFF",
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default LoadingBar;
