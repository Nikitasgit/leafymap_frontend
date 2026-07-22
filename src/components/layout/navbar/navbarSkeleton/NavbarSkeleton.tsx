"use client";

import styles from "./NavbarSkeleton.module.scss";

type NavbarSkeletonVariant = "desktop" | "mobile";

interface NavbarSkeletonProps {
  variant?: NavbarSkeletonVariant;
}

const NAV_ITEMS_COUNT = 4;

export default function NavbarSkeleton({
  variant = "desktop",
}: NavbarSkeletonProps) {
  const isDesktop = variant === "desktop";

  return (
    <div
      className={`${styles.container} ${
        isDesktop ? styles.desktop : styles.mobile
      }`}
      aria-hidden="true"
    >
      <div className={styles.navItems}>
        {Array.from({ length: NAV_ITEMS_COUNT }).map((_, i) => (
          <div key={i} className={styles.navItem}>
            <div className={`${styles.icon} skeleton`} />
            {isDesktop && <div className={`${styles.label} skeleton`} />}
          </div>
        ))}
      </div>
      <div className={styles.auth}>
        <div className={`${styles.authButton} skeleton`} />
      </div>
    </div>
  );
}
