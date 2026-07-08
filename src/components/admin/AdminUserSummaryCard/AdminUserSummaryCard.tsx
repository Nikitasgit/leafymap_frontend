"use client";

import { useState } from "react";
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
  const [reason, setReason] = useState(user.banReason || "");
  const [durationDays, setDurationDays] = useState("7");
  const isBanned = Boolean(
    user.bannedAt &&
      (!user.banExpiresAt || new Date(user.banExpiresAt) > new Date())
  );

  const handleBan = () => {
    const days = Number(durationDays);
    const duration = Number.isFinite(days) && days > 0 ? days * DAY : undefined;
    return onBan(reason || "Non-respect des règles", duration);
  };

  return (
    <section className={styles.card}>
      <div>
        <h2>{user.email}</h2>
        <p>{user.username || "Aucun username"}</p>
        <p>
          Role: {user.role || "user"} · Type: {user.userType}
        </p>
      </div>

      <div className={styles.actions}>
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Raison du ban"
        />
        <input
          value={durationDays}
          onChange={(event) => setDurationDays(event.target.value)}
          placeholder="Durée en jours"
          type="number"
          min="1"
        />
        {isBanned ? (
          <Button variant="secondary" onClick={onUnban}>
            Débannir
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleBan}>
            Bannir
          </Button>
        )}
        {user.deleted ? (
          <Button variant="secondary" onClick={onRestore}>
            Restaurer
          </Button>
        ) : (
          <Button variant="danger" onClick={onDelete}>
            Masquer
          </Button>
        )}
      </div>
    </section>
  );
};

export default AdminUserSummaryCard;
