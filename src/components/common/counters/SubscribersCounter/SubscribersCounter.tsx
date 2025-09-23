import { Users } from "lucide-react";
import React from "react";
import styles from "./SubscribersCounter.module.scss";

const SubscribersCounter = ({
  followers,
  title,
  withIcon = true,
}: {
  followers: number;
  title?: string;
  withIcon?: boolean;
}) => {
  return (
    <div className={styles.subscribersCounter}>
      <span className={styles.counter}>{followers || 0}</span>
      {title && <span className={styles.title}>{title}</span>}
      {withIcon && <Users size={12} />}
    </div>
  );
};

export default SubscribersCounter;
