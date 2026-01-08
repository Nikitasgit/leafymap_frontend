"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import styles from "./Tab.module.scss";
import { useTabsContainerContext } from "../TabsContainer/TabsContainer";

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
  const { hasMoved, isDragging } = useTabsContainerContext();

  const handleClick = () => {
    if (!hasMoved && !isDragging) {
      onClick(id);
    }
  };

  return (
    <button
      className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}
      onClick={handleClick}
    >
      <Icon size={16} />
      {typeof badge === "number" && badge > 0 && (
        <span className={styles.notification}>{badge}</span>
      )}
      {label}
    </button>
  );
}
