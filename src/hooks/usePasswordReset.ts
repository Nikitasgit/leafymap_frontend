import { useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "./useToast";
import { useRouter } from "next/navigation";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const requestPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      setLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
          { email },
          { withCredentials: true }
        );

        showSuccess(
          "Si cet email existe dans notre système, un lien de réinitialisation vous a été envoyé."
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message =
            error.response.data?.message ||
            "Erreur lors de la demande de réinitialisation";
          showError(message);
        } else {
          showError("Une erreur inattendue s'est produite");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const resetPassword = useCallback(
    async (
      userId: string,
      token: string,
      newPassword: string
    ): Promise<void> => {
      setLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
          { userId, token, newPassword },
          { withCredentials: true }
        );

        showSuccess("Votre mot de passe a été réinitialisé avec succès.");
        router.push("/auth/signin");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message =
            error.response.data?.message ||
            "Erreur lors de la réinitialisation du mot de passe";
          showError(message);
        } else {
          showError("Une erreur inattendue s'est produite");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError, router]
  );

  return {
    requestPasswordReset,
    resetPassword,
    loading,
  };
};
