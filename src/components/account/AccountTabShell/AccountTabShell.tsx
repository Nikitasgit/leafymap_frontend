"use client";

import React from "react";
import LoadingBar from "@/components/common/loading/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import styles from "./AccountTabShell.module.scss";

export interface AccountTabShellProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLoading: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

export default function AccountTabShell({
  icon,
  title,
  description,
  isLoading,
  isEmpty = false,
  emptyTitle,
  emptyMessage,
  children,
}: AccountTabShellProps) {
  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.shell}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <span className={styles.icon}>{icon}</span>
            {title}
          </p>
          <p className={styles.info}>{description}</p>
        </div>
      </div>
      {isEmpty ? (
        <EmptyState
          title={emptyTitle ?? title}
          description={emptyMessage ?? ""}
          icon={<span className={styles.emptyIcon}>{icon}</span>}
        />
      ) : (
        children
      )}
    </div>
  );
}
