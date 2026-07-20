"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { User } from "@/types/user";
import styles from "./AdminUserRow.module.scss";

const AdminUserRow = ({ user }: { user: User }) => {
  const { t, i18n } = useTranslation("admin");
  const router = useRouter();
  const dateLocale = i18n.language === "fr" ? "fr-FR" : "en-US";
  const isBanned = Boolean(
    user.bannedAt &&
      (!user.banExpiresAt || new Date(user.banExpiresAt) > new Date())
  );

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(dateLocale)
      : t("adminUserRow.never");

  return (
    <button
      className={styles.row}
      onClick={() => router.push(`/admin/users/${user.id}`)}
    >
      <span>
        <strong>{user.email}</strong>
        <small>{user.username || t("adminUserRow.noUsername")}</small>
      </span>
      <span>{user.userType}</span>
      <span>{user.role || "user"}</span>
      <span className={isBanned ? styles.warning : ""}>
        {isBanned
          ? t("adminUserRow.statusBanned")
          : user.deleted
            ? t("adminUserRow.statusHidden")
            : t("adminUserRow.statusActive")}
      </span>
      <span>{formatDate(user.lastLogin)}</span>
    </button>
  );
};

export default AdminUserRow;
