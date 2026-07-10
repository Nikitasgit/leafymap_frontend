import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { Image } from "@/types/image";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useImages = (
  reference: string | null,
  referenceType: "Place" | "User" | "Event" | "Message" | "Review" | null,
  type?: "profile" | "cover" | "gallery" | "other",
) => {
  const [images, setImages] = useState<Image[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("account");
  const canFetch = Boolean(reference && referenceType);

  const fetchImages = useCallback(async () => {
    if (!reference || !referenceType) {
      return;
    }
    try {
      let url = `/api/images/?reference=${reference}&referenceType=${referenceType}`;

      if (type) {
        url += `&type=${type}`;
      }

      const response = await apiClient.get(url, {});

      if (response.data && response.data.data && response.data.data.images) {
        setImages(response.data.data.images);
      } else {
        setImages([]);
        showError(t("useImages.invalidResponse"));
      }
    } catch (err) {
      showError(getErrorMessage(err, t, t("useImages.loadError")));
      setImages([]);
    }
  }, [reference, referenceType, type, showError, t]);

  const refetch = useCallback(async () => {
    if (!canFetch) return;
    await withLoading(fetchImages);
  }, [canFetch, fetchImages, withLoading]);

  useEffect(() => {
    if (!canFetch) return;
    void withLoading(fetchImages);
  }, [canFetch, fetchImages, withLoading]);

  return {
    images: canFetch ? images : [],
    isLoading: canFetch ? isLoading : false,
    refetch,
  };
};
