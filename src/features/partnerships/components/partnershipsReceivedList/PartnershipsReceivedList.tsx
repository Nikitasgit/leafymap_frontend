"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { Partnership } from "../../types";
import PartnershipCard from "../partnershipCard";
import Button from "@/shared/ui/buttons/button";
import styles from "./PartnershipsReceivedList.module.scss";

interface PartnershipsReceivedListProps {
  partnerships: Partnership[];
  isLoading?: boolean;
  isUpdating?: boolean;
  onAccept?: (partnershipId: string) => void;
  onRefuse?: (partnershipId: string) => void;
}

export default function PartnershipsReceivedList({
  partnerships,
  isLoading = false,
  isUpdating = false,
  onAccept,
  onRefuse,
}: PartnershipsReceivedListProps) {
  const { t } = useTranslation("account");

  if (isLoading) {
    return null;
  }

  if (partnerships.length === 0) {
    return null;
  }

  return (
    <div className={styles.list}>
      <ul className={styles.items}>
        {partnerships.map((partnership) => (
          <li key={partnership.id} className={styles.item}>
            <PartnershipCard
              user={
                partnership.initiator ?? {
                  id: partnership.id,
                  username: t("partnershipsReceivedList.fallbackUsername"),
                }
              }
              showCategory
            />
            <div className={styles.actions}>
              <Button
                type="button"
                variant="primary"
                size="small"
                fullWidth
                onClick={() => onAccept?.(partnership.id)}
                disabled={isUpdating}
                ariaLabel={t("partnershipsReceivedList.acceptAriaLabel")}
              >
                {t("partnershipsReceivedList.accept")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="small"
                fullWidth
                onClick={() => onRefuse?.(partnership.id)}
                disabled={isUpdating}
                ariaLabel={t("partnershipsReceivedList.refuseAriaLabel")}
              >
                {t("partnershipsReceivedList.refuse")}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
