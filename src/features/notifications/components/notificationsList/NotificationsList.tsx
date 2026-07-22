"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import NotificationCard from "../notificationCard";
import type { NotificationsListProps } from "./NotificationsList.types";
import styles from "./NotificationsList.module.scss";

export default function NotificationsList({
  notifications,
  onNotificationClick,
}: NotificationsListProps) {
  const { t } = useTranslation("notifications");

  if (!notifications.length) {
    return <div className={styles.empty}>{t("notificationsList.empty")}</div>;
  }

  return (
    <div className={styles.list} role="list">
      {notifications.map((notification) => (
        <div key={notification.id} role="listitem">
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
