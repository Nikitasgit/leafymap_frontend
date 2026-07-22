"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { User } from "@/features/users/types";
import SignOutButton from "@/shared/ui/buttons/signOutButton";
import NotificationBadge from "@/shared/ui/badges/notificationBadge";
import NavbarSkeleton from "../navbarSkeleton";
import styles from "./NavbarMenuDesktop.module.scss";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  display: boolean;
  badge?: number;
}

interface NavbarMenuDesktopProps {
  navItems: NavItem[];
  pathname: string;
  loading: boolean;
  user: User | null;
  logout: () => Promise<void>;
  t: (key: string) => string;
}

export default function NavbarMenuDesktop({
  navItems,
  pathname,
  loading,
  user,
  logout,
  t,
}: NavbarMenuDesktopProps) {
  if (loading) {
    return (
      <div className={styles.container}>
        <NavbarSkeleton variant="desktop" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.navLinks} role="menubar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          if (!item.display) return null;
          return (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                role="menuitem"
              >
                <div className={styles.iconContainer}>
                  <Icon className={styles.navIcon} aria-hidden="true" />
                </div>
                {item.badge != null && (
                  <NotificationBadge
                    count={item.badge}
                    className={styles.navBadge}
                  />
                )}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div>
        {user ? (
          <SignOutButton logout={logout} />
        ) : (
          <div className={styles.authLinks}>
            <Link
              href="/auth/register"
              className={`${styles.navLink} ${
                pathname === "/auth/register" ? styles.active : ""
              }`}
            >
              {t("nav.register")}
            </Link>
            <span className={styles.separator} aria-hidden="true">
              |
            </span>
            <Link
              href="/auth/signin"
              className={`${styles.navLink} ${
                pathname === "/auth/signin" ? styles.active : ""
              }`}
            >
              {t("nav.signin")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
