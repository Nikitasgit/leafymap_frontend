import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api/client";
import { UserPopulated } from "@/types/user";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useUser = (userId?: string) => {
  const [user, setUser] = useState<UserPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(!!userId);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      const url = `/api/users/${userId}`;
      const response = await apiClient.get(url);
      setUser(response.data.data.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de l'utilisateur";
      setUser(null);
      showErrorRef.current(errorMessage);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }
    withLoading(fetchUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const refetch = useCallback(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  return { user, isLoading, refetch };
};
