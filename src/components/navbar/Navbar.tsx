"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, User, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import SignOutButton from "../common/buttons/SignOutButton";
import styles from "./Navbar.module.scss";
import LoadingBar from "../common/loading/LoadingBar";
import { useAuth } from "@/hooks/useAuth";
import useOnClickOutside from "@/hooks/useOnClickOutside";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { loading, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

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

  useOnClickOutside(navbarRef, closeMobileMenu);
  return (
    <nav
      className={styles.navbar}
      ref={navbarRef}
      aria-label="Navigation principale"
    >
      <Link href="/" className={styles.logo}>
        SpotLight
      </Link>

      <div className={styles.navContainer}>
        <ul className={styles.navLinks} role="menubar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            if (!item.display) return null;
            return (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive ? styles.active : ""
                  }`}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={styles.navIcon} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

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
        )}

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className={styles.mobileMenu}
          aria-hidden={!isMobileMenuOpen}
          role="menu"
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
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={styles.mobileNavIcon} aria-hidden="true" />
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
