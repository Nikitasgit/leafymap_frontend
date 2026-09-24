"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef, useState, useSyncExternalStore } from "react";
import { useAppSelector } from "@/store";
import {
  NavbarNotifications,
  selectUnreadConversations,
} from "@/features/notifications";
import { useAuth } from "@/features/auth";
import useOnClickOutside from "@/shared/hooks/useOnClickOutside";
import NavbarLanguageSwitcher from "../navbarLanguageSwitcher";
import NavbarMenuDesktop from "../navbarMenuDesktop";
import NavbarMenuMobile from "../navbarMenuMobile";
import NavbarMobileMenuButton from "../navbarMobileMenuButton";
import { APP_NAME } from "@/shared/config/app";
import styles from "./Navbar.module.scss";
import logo from "../../../../../public/logo/logo-leafy-map.svg";

const subscribeHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

function useIsHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { loading, user, logout } = useAuth();
  const isHydrated = useIsHydrated();
  const sessionUser = isHydrated ? user : null;
  const authPending = !isHydrated || loading;
  const unreadConversations = useAppSelector(selectUnreadConversations);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home, display: true },
    { href: "/map", label: t("nav.map"), icon: Map, display: true },
    {
      href: "/inbox",
      label: t("nav.messages"),
      icon: MessageSquare,
      display: !!sessionUser,
      badge: unreadConversations > 0 ? unreadConversations : undefined,
    },
    {
      href: "/account",
      label: t("nav.account"),
      icon: User,
      display: !!sessionUser,
    },
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
      aria-label={t("navbar.mainNavAriaLabel")}
    >
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          <Image
            src={logo}
            alt={APP_NAME}
            width={150}
            height={40}
            priority
            className={styles.logoImage}
          />
        </Link>
      </div>
      <div className={styles.navSection}>
        <NavbarLanguageSwitcher />
        {sessionUser && <NavbarNotifications onBellClick={closeMobileMenu} />}
        <NavbarMenuDesktop
          navItems={navItems}
          pathname={pathname}
          loading={authPending}
          user={sessionUser}
          logout={logout}
          t={t}
        />
      </div>
      <NavbarMobileMenuButton
        isOpen={isMobileMenuOpen}
        onToggle={toggleMobileMenu}
      />
      <NavbarMenuMobile
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        pathname={pathname}
        loading={authPending}
        user={sessionUser}
        logout={logout}
        onClose={closeMobileMenu}
        t={t}
      />
    </nav>
  );
}
