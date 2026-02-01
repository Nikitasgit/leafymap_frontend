import React from "react";
import styles from "./ConversationViewSkeleton.module.scss";

const ConversationViewSkeleton: React.FC = () => (
  <div className={styles.pageContainer}>
    <section className={styles.container}>
      <div className={`${styles.backBar} skeleton`} />
      <div className={`${styles.cardBlock} skeleton`} />
      <div className={styles.messagesArea}>
        <div className={`${styles.bubble} ${styles.left} skeleton`} />
        <div className={`${styles.bubble} ${styles.right} skeleton`} />
        <div className={`${styles.bubble} ${styles.left} skeleton`} />
        <div className={`${styles.bubble} ${styles.right} skeleton`} />
      </div>
      <div className={`${styles.inputBar} skeleton`} />
    </section>
  </div>
);

export default ConversationViewSkeleton;
