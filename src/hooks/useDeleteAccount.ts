"use client";

import { useLoading } from "./useLoading";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useDeleteAccount = () => {
  const { isLoading: isLoadingDeleteAccount, withLoading } = useLoading(false);
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation("account");
  const isLoading = isLoadingDeleteAccount;

  const deleteAccount = async () => {
    try {
      await apiClient.delete(`/api/users`, {
      });
      showSuccess(t("useDeleteAccount.success"));
      window.location.reload();
    } catch (err: unknown) {
      console.error("Error deleting account:", err);
      showError(
        getErrorMessage(err, t, t("useDeleteAccount.errorFallback")),
      );
    } finally {
    }
  };

  const deleteAccountWithConfirmation = async () => {
    const confirmed = window.confirm(t("useDeleteAccount.confirmFirst"));

    if (confirmed) {
      const doubleConfirmed = window.confirm(t("useDeleteAccount.confirmSecond"));
      if (doubleConfirmed) {
        await withLoading(deleteAccount);
      }
    }
  };

  return {
    deleteAccount: deleteAccountWithConfirmation,
    isLoading,
  };
};
