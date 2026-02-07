"use client";

import { useState, useRef } from "react";
import { MoreVertical } from "lucide-react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import styles from "./ThreeDotsMenu.module.scss";
import type { ThreeDotsMenuProps } from "./ThreeDotsMenu.types";

export default function ThreeDotsMenu({
  actions,
  trigger,
  ariaLabel = "Ouvrir le menu",
  align = "right",
  className,
}: ThreeDotsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((open) => !open);
  };

  const handleActionClick = (onClick: () => void) => {
    setMenuOpen(false);
    onClick();
  };

  if (actions.length === 0) return null;

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
        aria-label={ariaLabel}
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        {trigger ?? <MoreVertical size={18} />}
      </button>
      {menuOpen && (
        <div
          className={`${styles.menu} ${
            align === "left" ? styles.alignLeft : styles.alignRight
          }`}
          role="menu"
        >
          {actions.map((action, index) => (
            <button
              key={`${action.label}-${index}`}
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onClick={() => handleActionClick(action.onClick)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
