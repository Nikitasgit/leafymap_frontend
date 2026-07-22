import React from "react";
import styles from "./ConversationCardSkeleton.module.scss";

const ConversationCardSkeleton: React.FC = () => (
  <div className={styles.card}>
    <div className={`${styles.avatar} skeleton`} />
    <div className={styles.content}>
      <div className={`${styles.line} ${styles.short} skeleton`} />
      <div className={`${styles.line} ${styles.long} skeleton`} />
    </div>
  </div>
);

export default ConversationCardSkeleton;
