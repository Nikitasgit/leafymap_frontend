import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { UserPopulated } from "@/types/user";
import { PlacePopulated } from "@/types/place";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useCreatorData = (userId?: string) => {
  const [user, setUser] = useState<UserPopulated | null>(null);
  const [place, setPlace] = useState<PlacePopulated | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const fetchAll = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setPlace(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get(`/api/users/${userId}/profile`);
      const profile: { user: UserPopulated; place: PlacePopulated | null } =
        response.data.data;
      setUser(profile.user);
      setPlace(profile.place);
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("useCreatorData.loadError")),
      );
      setUser(null);
      setPlace(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, showError, t]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    user,
    place,
    isLoading,
    refetch: fetchAll,
  };
};
