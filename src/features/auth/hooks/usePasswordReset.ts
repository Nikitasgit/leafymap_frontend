"use client";
import { useState, useCallback } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";
import { authApi } from "../api/authApi";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const { t } = useTranslation("auth");

  const requestPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      setLoading(true);
      try {
        await authApi.requestPasswordReset(email);
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
        await authApi.resetPassword(token, newPassword);
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
