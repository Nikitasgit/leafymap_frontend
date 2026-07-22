"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit3, Trash2, LucideIcon } from "lucide-react";
import Tooltip from "@/shared/ui/tooltip";
import styles from "./ActionButtons.module.scss";
import { ActionType, ActionButtonsProps } from "./ActionButtons.types";

const iconMap: Record<ActionType, LucideIcon> = {
  view: Eye,
  edit: Edit3,
  delete: Trash2,
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  iconSize = 15,
  className,
}) => {
  const { t } = useTranslation("common");

  const actionLabels: Record<ActionType, string> = {
    view: t("actions.view"),
    edit: t("actions.edit"),
    delete: t("actions.delete"),
  };

  if (actions.length === 0) return null;

  return (
    <div className={`${styles.actionButtons} ${className || ""}`}>
      {actions.map((action, index) => {
        const Icon = iconMap[action.type];
        if (!Icon) return null;

        const tooltipText = action.ariaLabel || actionLabels[action.type];

        return (
          <Tooltip
            key={`${action.type}-${index}`}
            tooltip={tooltipText}
            place="top-left"
            delay={1000}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              disabled={action.disabled}
              aria-label={action.ariaLabel || `${action.type} action`}
              className={`${styles.actionButton} ${styles[action.type]}`}
            >
              <Icon size={iconSize} />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ActionButtons;
