"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, User } from "lucide-react";
import SignOutButton from "../common/buttons/SignOutButton";
import { useUser } from "@/hooks/useUser";
import styles from "./Navbar.module.scss";
import LoadingBar from "../common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";

export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Map", icon: Map },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/account", label: "Account", icon: User },
  ];

  const { user, loading, error } = useUser();
  const { showError } = useToast();

  if (error) {
    showError(error);
  }

  if (loading) {
    return <LoadingBar />;
  }

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
        <div>
          {user ? (
            <SignOutButton />
          ) : (
            <div className={styles.authLinks}>
              <Link
                href="/auth/register"
                className={`${styles.navLink} ${
                  pathname === "/auth/register" ? styles.active : ""
                }`}
              >
                S&apos;inscrire
              </Link>
              <span>|</span>
              <Link
                href="/auth/signin"
                className={`${styles.navLink} ${
                  pathname === "/auth/signin" ? styles.active : ""
                }`}
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
