"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useAdminUserSearch } from "@/hooks/useAdminUsers";
import TextField from "@/components/common/inputs/TextField";
import AdminUserRow from "../AdminUserRow/AdminUserRow";
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
