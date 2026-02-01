"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import NavbarMenuDesktop from "../NavbarMenuDesktop";
import NavbarMenuMobile from "../NavbarMenuMobile";
import NavbarMobileMenuButton from "../NavbarMobileMenuButton";
import styles from "./Navbar.module.scss";
import logo from "../../../../public/logo/logo.png";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { loading, user, logout } = useAuth();
  const { unreadMessagesCount } = useUserNotifications({
    autoFetch: !!user,
    refetchInterval: 60000,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home, display: true },
    { href: "/map", label: t("nav.map"), icon: Map, display: true },
    {
      href: "/inbox",
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
        <Image
          src={logo}
          alt="SpotLight"
          width={150}
          height={40}
          priority
          className={styles.logoImage}
        />
      </Link>
      <NavbarMenuDesktop
        navItems={navItems}
        pathname={pathname}
        loading={loading}
        user={user}
        logout={logout}
        t={t}
        unreadMessagesCount={unreadMessagesCount}
      />
      <NavbarMobileMenuButton
        isOpen={isMobileMenuOpen}
        onToggle={toggleMobileMenu}
      />
      <NavbarMenuMobile
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        pathname={pathname}
        loading={loading}
        user={user}
        logout={logout}
        onClose={closeMobileMenu}
        t={t}
        unreadMessagesCount={unreadMessagesCount}
      />
    </nav>
  );
}
