import { useState, useEffect, useCallback } from "react";
import { fetchUserProfile } from "@/features/users/api/usersApi";
import { UserPopulated } from "@/features/users/types";
import { PlacePopulated } from "@/features/places/types/place";
import { useToast } from "@/shared/hooks/useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";

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
      const profile = await fetchUserProfile(userId);
      setUser(profile.user);
      setPlace(profile.place);
    } catch (err) {
      showError(getErrorMessage(err, t, t("useCreatorData.loadError")));
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

export default useCreatorData;
