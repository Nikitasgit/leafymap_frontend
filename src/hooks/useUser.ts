import { useState, useEffect } from "react";
import { UserPopulated } from "@/types/user";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { getUserById } from "@/lib/api/users";

export const useUser = (userId?: string) => {
  const [user, setUser] = useState<UserPopulated | null>(null);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const result = await getUserById(userId);
      if (typeof result === "string") {
        setUser(null);
        showError(result);
      } else {
        setUser(result);
      }
    };
    
    if (userId) {
      withLoading(fetchUser);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { user, isLoading };
};
