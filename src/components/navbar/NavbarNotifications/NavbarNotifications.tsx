"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import Button from "../../common/buttons/Button";
import { NotificationsList } from "../../common/notifications";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { handleNotificationRedirect } from "@/utils/accountTabs";
import type { Notification } from "@/types/notifications";
import styles from "./NavbarNotifications.module.scss";

interface NavbarNotificationsProps {
  onBellClick?: () => void;
}

export default function NavbarNotifications({
  onBellClick,
}: NavbarNotificationsProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { notifications, unreadCount, markAllNotificationsAsRead } =
    useUserNotifications({
      autoFetch: true,
      refetchInterval: 60000,
    });

  useOnClickOutside(wrapperRef, () => setIsOpen(false));

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      handleNotificationRedirect(notification, router, () => setIsOpen(false));
    },
    [router]
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Button
        type="button"
        variant="simple"
        startIcon={<Bell className={styles.icon} aria-hidden="true" />}
        badge={unreadCount > 0 ? unreadCount : undefined}
        ariaLabel="Notifications"
        onClick={() => {
          onBellClick?.();
          setIsOpen((v) => {
            if (!v && unreadCount > 0) {
              markAllNotificationsAsRead();
            }
            return !v;
          });
        }}
        className={styles.button}
      />
      {isOpen && (
        <div className={styles.dropdown}>
          <NotificationsList
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      )}
    </div>
  );
}
