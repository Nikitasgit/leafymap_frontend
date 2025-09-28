"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import styles from "./Tab.module.scss";

interface TabProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function Tab({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: TabProps) {
  return (
    <button
      className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}
      onClick={() => onClick(id)}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
