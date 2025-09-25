"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, User, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import SignOutButton from "../common/buttons/SignOutButton";
import styles from "./Navbar.module.scss";
import LoadingBar from "../common/loading/LoadingBar";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { loading, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home, display: true },
    { href: "/map", label: t("nav.map"), icon: Map, display: true },
    {
      href: "/messages",
      label: t("nav.messages"),
      icon: MessageSquare,
      display: !!user,
    },
    { href: "/account", label: t("nav.account"), icon: User, display: !!user },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
            if (!item.display) return null;
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

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className={styles.mobileMenu}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className={styles.mobileMenuContent}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              if (!item.display) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Icon className={styles.mobileNavIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {!user && (
              <div className={styles.mobileAuthLinks}>
                <Link
                  href="/auth/register"
                  className={`${styles.mobileNavLink} ${
                    pathname === "/auth/register" ? styles.active : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {t("nav.register")}
                </Link>
                <Link
                  href="/auth/signin"
                  className={`${styles.mobileNavLink} ${
                    pathname === "/auth/signin" ? styles.active : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {t("nav.signin")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
