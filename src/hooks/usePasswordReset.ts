import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { useToast } from "./useToast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { t } = useTranslation("auth");

  const requestPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      setLoading(true);
      try {
        await apiClient.post(`/api/auth/forgot-password`, { email }, {});

        showSuccess(t("usePasswordReset.requestSuccess"));
      } catch (error) {
        showError(
          getErrorMessage(error, t, t("usePasswordReset.requestErrorFallback")),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError, t],
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<void> => {
      setLoading(true);
      try {
        await apiClient.post(
          `/api/auth/reset-password`,
          { token, newPassword },
          {},
        );

        showSuccess(t("usePasswordReset.resetSuccess"));
        router.push("/auth/signin");
      } catch (error) {
        showError(
          getErrorMessage(error, t, t("usePasswordReset.resetErrorFallback")),
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError, router, t],
  );

  return {
    requestPasswordReset,
    resetPassword,
    loading,
  };
};
