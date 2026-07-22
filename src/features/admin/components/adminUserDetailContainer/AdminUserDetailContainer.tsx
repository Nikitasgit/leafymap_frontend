"use client";

import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/ui/pageHeader";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import EmptyState from "@/shared/ui/noResults/emptyState";
import { useToast } from "@/shared/hooks/useToast";
import {
  useAdminResourceActions,
  useAdminUserActions,
  useAdminUserDetail,
} from "../../hooks/useAdminUsers";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import AdminUserSummaryCard from "../adminUserSummaryCard";
import AdminUserTabs from "../adminUserTabs";
import styles from "./AdminUserDetailContainer.module.scss";

const AdminUserDetailContainer = ({ userId }: { userId: string }) => {
  const { t } = useTranslation("admin");
  const { user, content, isLoading, refetch } = useAdminUserDetail(userId);
  const { showError, showSuccess } = useToast();
  const userActions = useAdminUserActions(userId, refetch);
  const resourceActions = useAdminResourceActions(refetch);

  const withFeedback = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      showSuccess(message);
    } catch (error) {
      showError(
        getErrorMessage(error, t, t("adminUserDetailContainer.actionFailed")),
      );
    }
  };

  if (isLoading) return <LoadingBar />;

  if (!user || !content) {
    return <EmptyState title={t("adminUserDetailContainer.userNotFound")} isError />;
  }

  return (
    <main className={styles.container}>
      <PageHeader
        title={user.email}
        subtitle={t("adminUserDetailContainer.subtitle")}
        showBackButton
        path="/admin/users"
      />

      <AdminUserSummaryCard
        user={user}
        onBan={(reason, duration) =>
          withFeedback(
            () => userActions.ban(reason, duration),
            t("adminUserDetailContainer.userBanned"),
          )
        }
        onUnban={() =>
          withFeedback(userActions.unban, t("adminUserDetailContainer.userUnbanned"))
        }
        onDelete={() =>
          withFeedback(
            userActions.softDeleteUser,
            t("adminUserDetailContainer.userHidden"),
          )
        }
        onRestore={() =>
          withFeedback(
            userActions.restoreUser,
            t("adminUserDetailContainer.userRestored"),
          )
        }
      />

      <AdminUserTabs
        content={content}
        onDelete={(resource, id) =>
          withFeedback(
            () => resourceActions.softDelete(resource, id),
            t("adminUserDetailContainer.contentDeleted"),
          )
        }
        onRestore={(resource, id) =>
          withFeedback(
            () => resourceActions.restore(resource, id),
            t("adminUserDetailContainer.contentRestored"),
          )
        }
      />
    </main>
  );
};

export default AdminUserDetailContainer;
