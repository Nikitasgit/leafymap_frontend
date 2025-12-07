import { useState, useEffect, useCallback, useRef } from "react";
import { UserPopulated } from "@/types/user";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import axios from "axios";

export const useUser = (userId?: string) => {
  const [user, setUser] = useState<UserPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);

  // Keep ref updated
  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchUser = useCallback(async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`;
      const response = await axios.get(url);
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
    if (userId) {
      withLoading(fetchUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const refetch = useCallback(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  return { user, isLoading, refetch };
};
