"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/ui/pageHeader";
import EmptyState from "@/shared/ui/noResults/emptyState";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useAdminUserSearch } from "../../hooks/useAdminUsers";
import TextField from "@/shared/ui/inputs/textField";
import AdminUserRow from "../adminUserRow";
import styles from "./AdminUsersSearchContainer.module.scss";

const AdminUsersSearchContainer = () => {
  const { t } = useTranslation("admin");
  const [email, setEmail] = useState("");
  const { users, isLoading } = useAdminUserSearch(email);
  const hasSearch = email.trim().length > 0;

  return (
    <main className={styles.container}>
      <PageHeader
        title={t("adminUsersSearchContainer.title")}
        subtitle={t("adminUsersSearchContainer.subtitle")}
      />

      <Link href="/admin/announcements" className={styles.navLink}>
        {t("adminUsersSearchContainer.toAnnouncements")}
      </Link>

      <TextField
        name="adminUserSearch"
        className={styles.searchInput}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t("adminUsersSearchContainer.searchPlaceholder")}
        type="email"
        fullWidth
      />

      {isLoading && <LoadingBar />}

      <section className={styles.results}>
        {!hasSearch && (
          <EmptyState title={t("adminUsersSearchContainer.emptySearchTitle")} />
        )}
        {hasSearch && !isLoading && users.length === 0 && (
          <EmptyState title={t("adminUsersSearchContainer.noUsersFoundTitle")} />
        )}
        {users.map((user) => (
          <AdminUserRow key={user.id} user={user} />
        ))}
      </section>
    </main>
  );
};

export default AdminUsersSearchContainer;
