import { useState, useEffect } from "react";
import axios from "axios";
import { UserPopulated } from "@/types/user";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data.data.user);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement de l'utilisateur";
        setUser(null);
        showError(errorMessage);
      }
    };

    withLoading(fetchCurrentUser);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, isLoading };
};
