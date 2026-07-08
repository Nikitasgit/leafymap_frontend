"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/noResults/EmptyState";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useAdminUserSearch } from "@/hooks/useAdminUsers";
import AdminUserRow from "../AdminUserRow/AdminUserRow";
import styles from "./AdminUsersSearchContainer.module.scss";

const AdminUsersSearchContainer = () => {
  const [email, setEmail] = useState("");
  const { users, isLoading } = useAdminUserSearch(email);
  const hasSearch = email.trim().length > 0;

  return (
    <main className={styles.container}>
      <PageHeader
        title="Administration utilisateurs"
        subtitle="Rechercher un compte par email et gérer son contenu."
      />

      <input
        className={styles.searchInput}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Rechercher par email"
        type="search"
      />

      {isLoading && <LoadingBar />}

      <section className={styles.results}>
        {!hasSearch && (
          <EmptyState title="Saisissez un email pour lancer une recherche" />
        )}
        {hasSearch && !isLoading && users.length === 0 && (
          <EmptyState title="Aucun utilisateur trouvé" />
        )}
        {users.map((user) => (
          <AdminUserRow key={user._id} user={user} />
        ))}
      </section>
    </main>
  );
};

export default AdminUsersSearchContainer;
