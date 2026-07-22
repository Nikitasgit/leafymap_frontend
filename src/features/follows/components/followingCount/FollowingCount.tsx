"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Leaf } from "lucide-react";
import styles from "./FollowingCount.module.scss";

interface FollowingCountProps {
  count: number;
  userId?: string;
}

const FollowingCount: React.FC<FollowingCountProps> = ({ count }) => {
  const { t } = useTranslation("common");

  if (count <= 0) {
    return null;
  }

  return (
    <div className={styles.followingCount}>
      <span className={styles.count}>{count}</span>
      <span className={styles.label}>
        {t("followingCount.follower", { count })}
      </span>
      <Leaf size={14} className={styles.icon} aria-hidden="true" />
    </div>
  );
};

export default FollowingCount;
