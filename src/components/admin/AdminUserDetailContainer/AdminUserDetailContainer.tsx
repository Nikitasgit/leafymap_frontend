"use client";

import PageHeader from "@/components/common/PageHeader";
import LoadingBar from "@/components/common/loading/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import { useToast } from "@/hooks/useToast";
import {
  useAdminResourceActions,
  useAdminUserActions,
  useAdminUserDetail,
} from "@/hooks/useAdminUsers";
import AdminUserSummaryCard from "../AdminUserSummaryCard/AdminUserSummaryCard";
import AdminUserTabs from "../AdminUserTabs/AdminUserTabs";
import styles from "./AdminUserDetailContainer.module.scss";

const AdminUserDetailContainer = ({ userId }: { userId: string }) => {
  const { user, content, isLoading, refetch } = useAdminUserDetail(userId);
  const { showError, showSuccess } = useToast();
  const userActions = useAdminUserActions(userId, refetch);
  const resourceActions = useAdminResourceActions(refetch);

  const withFeedback = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      showSuccess(message);
    } catch (error) {
      showError("Action impossible");
    }
  };

  if (isLoading) return <LoadingBar />;

  if (!user || !content) {
    return <EmptyState title="Utilisateur introuvable" isError />;
  }

  return (
    <main className={styles.container}>
      <PageHeader
        title={user.email}
        subtitle="Gestion du compte et de son contenu"
        showBackButton
        path="/admin/users"
      />

      <AdminUserSummaryCard
        user={user}
        onBan={(reason, duration) =>
          withFeedback(() => userActions.ban(reason, duration), "Utilisateur banni")
        }
        onUnban={() => withFeedback(userActions.unban, "Utilisateur débanni")}
        onDelete={() => withFeedback(userActions.softDeleteUser, "Utilisateur masqué")}
        onRestore={() => withFeedback(userActions.restoreUser, "Utilisateur restauré")}
      />

      <AdminUserTabs
        content={content}
        onDelete={(resource, id) =>
          withFeedback(() => resourceActions.softDelete(resource, id), "Contenu supprimé")
        }
        onRestore={(resource, id) =>
          withFeedback(() => resourceActions.restore(resource, id), "Contenu restauré")
        }
      />
    </main>
  );
};

export default AdminUserDetailContainer;
