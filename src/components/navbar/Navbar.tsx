"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import SignOutButton from "../common/buttons/SignOutButton";
import styles from "./Navbar.module.scss";
import LoadingBar from "../common/loading/LoadingBar";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation("common");

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/map", label: t("nav.map"), icon: Map },
    { href: "/messages", label: t("nav.messages"), icon: MessageSquare },
    { href: "/account", label: t("nav.account"), icon: User },
  ];

  const { loading, user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        SpotLight
      </Link>
      <div className={styles.navContainer}>
        <div className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        {loading ? (
          <LoadingBar />
        ) : (
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
                <span>|</span>
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
        )}
      </div>
    </nav>
  );
}
