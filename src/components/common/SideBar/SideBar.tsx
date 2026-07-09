"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, LucideIcon } from "lucide-react";
import Button from "@/components/common/buttons/Button";
import NotificationBadge from "@/components/common/badges/NotificationBadge";
import styles from "./SideBar.module.scss";

const SIDEBAR_ANIMATION_DURATION_MS = 300;

export interface SideBarTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
  badge?: number;
  display?: "all" | "creatorOnly" | "nonCreatorOnly";
}

export interface SideBarProps {
  title?: string;
  tabs?: SideBarTab[];
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onTabChange?: (tabId: string) => void;
  initialTabId?: string;
  className?: string;
}

const SideBar = ({
  title,
  tabs,
  children,
  isOpen,
  onClose,
  onTabChange,
  initialTabId,
  className,
}: SideBarProps) => {
  const { t } = useTranslation("common");
  const [activeTabId, setActiveTabId] = useState(tabs?.[0]?.id ?? "");
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, SIDEBAR_ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialTabId && tabs?.some((t) => t.id === initialTabId)) {
      setActiveTabId(initialTabId);
      onTabChange?.(initialTabId);
    }
  }, [isOpen, initialTabId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    onTabChange?.(tabId);
  };

  const activeTab = tabs?.find((tab) => tab.id === activeTabId);
  const content = tabs ? activeTab?.content : children;

  return (
    <aside
      className={`${styles.sideBar} ${isOpen ? styles.open : styles.closed} ${
        className || ""
      }`}
      aria-hidden={!isOpen}
    >
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <Button
          type="button"
          variant="simple"
          size="small"
          onClick={onClose}
          ariaLabel={t("navbar.closeMenuAriaLabel")}
          startIcon={<X size={20} />}
        />
      </div>
      {isContentVisible && tabs && tabs.length > 0 && (
        <nav className={styles.tabs}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const badgeCount = tab.badge ?? 0;
            return (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tab} ${
                  activeTabId === tab.id ? styles.activeTab : ""
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {Icon && <Icon size={18} />}
                <span>{tab.label}</span>
                {badgeCount > 0 && (
                  <NotificationBadge
                    count={badgeCount}
                    className={styles.tabBadge}
                  />
                )}
              </button>
            );
          })}
        </nav>
      )}
      <div className={styles.content}>{isContentVisible ? content : null}</div>
    </aside>
  );
};

export default SideBar;
