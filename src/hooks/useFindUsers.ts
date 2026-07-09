import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { UserPopulated } from "@/types/user";
import { useToast } from "./useToast";
import { useLoading } from "./useLoading";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useFindUsers = () => {
  const [users, setUsers] = useState<UserPopulated[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { showError } = useToast();
  const { t } = useTranslation("account");

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

          const res = await apiClient.get(
            `/api/users/?${searchParams.toString()}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          const data = res.data.data;
          setUsers(data);
          return data;
        } catch (err) {
          setUsers([]);
          showError(
            getErrorMessage(err, t, t("useFindUsers.searchErrorFallback")),
          );
          console.error("Error searching users:", err);
          return [];
        }
      });
    },
    [withLoading, showError, t]
  );

  return {
    users,
    isLoading,
    searchUsers,
  };
};
