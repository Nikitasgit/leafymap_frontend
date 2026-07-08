"use client";

import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import styles from "./AdminUserRow.module.scss";

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("fr-FR") : "Jamais";

const AdminUserRow = ({ user }: { user: User }) => {
  const router = useRouter();
  const isBanned = Boolean(
    user.bannedAt &&
      (!user.banExpiresAt || new Date(user.banExpiresAt) > new Date())
  );

  return (
    <button
      className={styles.row}
      onClick={() => router.push(`/admin/users/${user._id}`)}
    >
      <span>
        <strong>{user.email}</strong>
        <small>{user.username || "Aucun username"}</small>
      </span>
      <span>{user.userType}</span>
      <span>{user.role || "user"}</span>
      <span className={isBanned ? styles.warning : ""}>
        {isBanned ? "Banni" : user.deleted ? "Masqué" : "Actif"}
      </span>
      <span>{formatDate(user.lastLogin)}</span>
    </button>
  );
};

export default AdminUserRow;
