"use client";

import React from "react";
import NotificationCard from "../NotificationCard";
import type { NotificationsListProps } from "./NotificationsList.types";
import styles from "./NotificationsList.module.scss";

export default function NotificationsList({
  notifications,
  onNotificationClick,
}: NotificationsListProps) {
  if (!notifications.length) {
    return <div className={styles.empty}>Aucune notification</div>;
  }

  return (
    <div className={styles.list} role="list">
      {notifications.map((notification) => (
        <div key={notification._id} role="listitem">
          <NotificationCard
            notification={notification}
            onClick={
              onNotificationClick
                ? () => onNotificationClick(notification)
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
