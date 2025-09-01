import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/user";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
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
        showError(errorMessage);
      }
    };

    if (userId) {
      withLoading(fetchUser);
    }
  }, [userId]);

  return { user, isLoading };
};
