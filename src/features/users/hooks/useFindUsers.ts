import { useState } from "react";
import { searchUsers as searchUsersApi } from "../api/usersApi";
import { UserPopulated } from "../types";
import { useToast } from "@/shared/hooks/useToast";
import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";

export const useFindUsers = () => {
  const [users, setUsers] = useState<UserPopulated[]>([]);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const { mutate: searchUsers, isLoading } = useApiMutation(
    async (
      queryParams: Record<string, string | string[]>,
      limit: number = 5,
    ): Promise<UserPopulated[]> => {
      try {
        const data = await searchUsersApi(queryParams, limit);
        setUsers(data);
        return data;
      } catch (err) {
        setUsers([]);
        showError(
          getErrorMessage(err, t, t("useFindUsers.searchErrorFallback")),
        );
        return [];
      }
    },
    { onError: "silent" },
  );

  return {
    users,
    isLoading,
    searchUsers,
  };
};

export default useFindUsers;
