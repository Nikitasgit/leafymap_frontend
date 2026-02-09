"use client";

import Link from "next/link";
import { LucideIcon, LogOut } from "lucide-react";
import { User } from "@/types/user";
import NotificationBadge from "../../common/badges/NotificationBadge";
import NavbarSkeleton from "../NavbarSkeleton";
import styles from "./NavbarMenuMobile.module.scss";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  display: boolean;
  badge?: number;
}

interface NavbarMenuMobileProps {
  isOpen: boolean;
  navItems: NavItem[];
  pathname: string;
  loading?: boolean;
  user: User | null;
  logout: () => Promise<void>;
  onClose: () => void;
  t: (key: string) => string;
}

export default function NavbarMenuMobile({
  isOpen,
  navItems,
  pathname,
  loading = false,
  user,
  logout,
  onClose,
  t,
}: NavbarMenuMobileProps) {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div
        id="mobile-menu"
        className={styles.menu}
        aria-hidden={!isOpen}
        role="menu"
      >
        <div className={styles.content}>
          <NavbarSkeleton variant="mobile" />
        </div>
      </div>
    );
  }

  return (
    <div
      id="mobile-menu"
      className={styles.menu}
      aria-hidden={!isOpen}
      role="menu"
    >
      <div className={styles.content}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          if (!item.display) return null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              onClick={onClose}
              role="menuitem"
              aria-current={isActive ? "page" : undefined}
            >
              <div className={styles.iconContainer}>
                <Icon className={styles.icon} aria-hidden="true" />
                {item.badge != null && (
                  <NotificationBadge
                    count={item.badge}
                    absolutePosition
                  />
                )}
              </div>
              <div className={styles.labelContainer}>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        <div className={styles.authSection}>
          {user ? (
            <button
              className={styles.navLink}
              onClick={() => {
                logout();
                onClose();
              }}
              role="menuitem"
            >
              <LogOut className={styles.icon} aria-hidden="true" />
              <span>{t("nav.signout")}</span>
            </button>
          ) : (
            <div className={styles.authLinks}>
              <Link
                href="/auth/register"
                className={`${styles.navLink} ${
                  pathname === "/auth/register" ? styles.active : ""
                }`}
                onClick={onClose}
              >
                {t("nav.register")}
              </Link>
              <Link
                href="/auth/signin"
                className={`${styles.navLink} ${
                  pathname === "/auth/signin" ? styles.active : ""
                }`}
                onClick={onClose}
              >
                {t("nav.signin")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
