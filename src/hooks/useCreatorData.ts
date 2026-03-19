import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UserPopulated } from "@/types/user";
import { PlacePopulated } from "@/types/place";
import { useToast } from "./useToast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getPlaceId = (user: UserPopulated): string | null => {
  if (!user.place) return null;
  return typeof user.place === "string" ? user.place : user.place._id;
};

export const useCreatorData = (userId?: string) => {
  const [user, setUser] = useState<UserPopulated | null>(null);
  const [place, setPlace] = useState<PlacePopulated | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);
  const { showError } = useToast();

  const fetchAll = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setPlace(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userRes = await axios.get(`${API_URL}/api/users/${userId}`);
      const fetchedUser: UserPopulated = userRes.data.data.user;
      setUser(fetchedUser);
      setPlace(null);

      const placeId = getPlaceId(fetchedUser);
      if (placeId) {
        const placeRes = await axios.get(
          `${API_URL}/api/places/${placeId}?scheduleWithEvents=true`
        );
        setPlace(placeRes.data.data);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du profil";
      showError(message);
      setUser(null);
      setPlace(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

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
