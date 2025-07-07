import { useState, useCallback } from "react";
import api from "../utils/axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

interface VerifyTokenResponse {
  message: string;
  data?: {
    user: {
      id: string;
      userType: string;
      username: string;
      email: string;
    };
  };
}

export const useVerifyToken = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [user, setUser] = useState<VerifyTokenResponse["data"] | null>(null);
  const { isLoading, withLoading } = useLoading(false);
  const { showError, showSuccess } = useToast();

  const verifyToken = useCallback(
    async (token: string): Promise<boolean> => {
      const verify = async () => {
        try {
          const response = await api.get<VerifyTokenResponse>("/auth/verify", {
            headers: {
              Cookie: `token=${token}`,
            },
            withCredentials: true,
          });

          const isValidToken = !!response.data.data;
          setIsValid(isValidToken);

          if (isValidToken && response.data.data) {
            setUser(response.data.data);
            showSuccess("Token vérifié avec succès");
          } else {
            setUser(null);
            showError("Token invalide");
          }

          return isValidToken;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erreur lors de la vérification du token";

          setIsValid(false);
          setUser(null);
          showError(errorMessage);
          return false;
        }
      };

      return withLoading(verify);
    },
    [withLoading, showSuccess, showError]
  );

  const reset = useCallback(() => {
    setIsValid(null);
    setUser(null);
  }, []);

  return {
    verifyToken,
    isValid,
    user,
    loading: isLoading,
    reset,
  };
};
