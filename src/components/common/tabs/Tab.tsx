"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import styles from "./Tab.module.scss";

interface TabProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  badge?: number;
  onClick: (id: string) => void;
}

export default function Tab({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
  badge,
}: TabProps) {
  return (
    <button
      className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}
      onClick={() => onClick(id)}
    >
      <Icon size={20} />
      {typeof badge === "number" && badge > 0 && (
        <span className={styles.notification}>{badge}</span>
      )}
      {label}
    </button>
  );
}
