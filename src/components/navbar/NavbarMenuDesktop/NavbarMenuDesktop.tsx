"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { User } from "@/types/user";
import SignOutButton from "../../common/buttons/SignOutButton";
import NavbarSkeleton from "../NavbarSkeleton";
import styles from "./NavbarMenuDesktop.module.scss";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  display: boolean;
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
