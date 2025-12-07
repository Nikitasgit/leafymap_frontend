import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { PlacePopulated } from "@/types/place";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const usePlace = (placeId: string | null) => {
  const [place, setPlace] = useState<PlacePopulated | null>(null);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);
  const stopLoadingRef = useRef(stopLoading);

  // Keep refs updated
  useEffect(() => {
    showErrorRef.current = showError;
    stopLoadingRef.current = stopLoading;
  }, [showError, stopLoading]);

  const fetchPlace = useCallback(async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/places/${placeId}`;

      const response = await axios.get(url);

      if (response.data && response.data.data) {
        setPlace(response.data.data);
      } else {
        setPlace(null);
        showErrorRef.current("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du lieu";
      setPlace(null);
      showErrorRef.current(errorMessage);
    }
  }, [placeId]);

  useEffect(() => {
    if (placeId) {
      withLoading(fetchPlace);
    } else {
      setPlace(null);
      stopLoadingRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  const refetch = useCallback(() => {
    if (placeId) {
      fetchPlace();
    }
  }, [placeId, fetchPlace]);

  return { place, isLoading, refetch };
};
