"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/common/buttons/Button";
import { User } from "@/types/user";
import styles from "./AdminUserSummaryCard.module.scss";

const DAY = 24 * 60 * 60 * 1000;

const AdminUserSummaryCard = ({
  user,
  onBan,
  onUnban,
  onDelete,
  onRestore,
}: {
  user: User;
  onBan: (reason: string, duration?: number) => Promise<void>;
  onUnban: () => Promise<void>;
  onDelete: () => Promise<void>;
  onRestore: () => Promise<void>;
}) => {
  const { t } = useTranslation("admin");
  const [reason, setReason] = useState(user.banReason || "");
  const [durationDays, setDurationDays] = useState("7");
  const isBanned = Boolean(
    user.bannedAt &&
      (!user.banExpiresAt || new Date(user.banExpiresAt) > new Date())
  );

  const handleBan = () => {
    const days = Number(durationDays);
    const duration = Number.isFinite(days) && days > 0 ? days * DAY : undefined;
    return onBan(reason || t("adminUserSummaryCard.defaultBanReason"), duration);
  };

  return (
    <section className={styles.card}>
      <div>
        <h2>{user.email}</h2>
        <p>{user.username || t("adminUserSummaryCard.noUsername")}</p>
        <p>
          {t("adminUserSummaryCard.roleType", {
            role: user.role || "user",
            userType: user.userType,
          })}
        </p>
      </div>

      <div className={styles.actions}>
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t("adminUserSummaryCard.banReasonPlaceholder")}
        />
        <input
          value={durationDays}
          onChange={(event) => setDurationDays(event.target.value)}
          placeholder={t("adminUserSummaryCard.durationDaysPlaceholder")}
          type="number"
          min="1"
        />
        {isBanned ? (
          <Button variant="secondary" onClick={onUnban}>
            {t("adminUserSummaryCard.unban")}
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleBan}>
            {t("adminUserSummaryCard.ban")}
          </Button>
        )}
        {user.deleted ? (
          <Button variant="secondary" onClick={onRestore}>
            {t("adminUserSummaryCard.restore")}
          </Button>
        ) : (
          <Button variant="danger" onClick={onDelete}>
            {t("adminUserSummaryCard.hide")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default AdminUserSummaryCard;
