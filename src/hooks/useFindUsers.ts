import { useState, useCallback } from "react";
import axios from "axios";
import { UserPopulated } from "@/types/user";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";

export const useFindUsers = () => {
  const [users, setUsers] = useState<UserPopulated[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();

  const searchUsers = useCallback(
    async (
      queryParams: Record<string, string | string[]>,
      limit: number = 5
    ): Promise<UserPopulated[]> => {
      return withLoading(async () => {
        try {
          const searchParams = new URLSearchParams();
          Object.entries(queryParams || {}).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          });
          searchParams.append("limit", limit.toString());

          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/api/users/?${searchParams.toString()}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          const data = res.data.data;
          setUsers(data);
          return data;
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Erreur lors de la recherche d'utilisateurs";
          setUsers([]);
          showError(errorMessage);
          console.error("Error searching users:", err);
          return [];
        }
      });
    },
    [withLoading, showError]
  );

  return {
    users,
    isLoading,
    searchUsers,
  };
};
