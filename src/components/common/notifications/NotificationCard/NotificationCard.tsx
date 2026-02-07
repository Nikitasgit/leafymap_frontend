"use client";

import React from "react";
import { Avatar } from "@/components/common/Avatar";
import { getDisplayName } from "@/utils/userDisplay";
import { translateNotificationAction } from "@/utils/notifications";
import type { NotificationCardProps } from "./NotificationCard.types";
import styles from "./NotificationCard.module.scss";

const AVATAR_SIZE = 40;

export default function NotificationCard({
  notification,
  onClick,
}: NotificationCardProps) {
  const sender = notification.sender;
  const displayName = getDisplayName(sender ?? undefined);
  const message = translateNotificationAction(notification.action);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`${displayName}: ${message}`}
    >
      <div className={styles.avatarWrap}>
        <Avatar user={sender ?? null} size={AVATAR_SIZE} />
      </div>
      <div className={styles.content}>
        <p className={styles.name}>{displayName}</p>
        <p className={styles.message}>{message}</p>
      </div>
    </button>
  );
}
