import { useState, useEffect, useCallback } from "react";
import { fetchImages as fetchImagesRequest } from "@/shared/api/imagesApi";
import { Image } from "@/shared/types/image";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/shared/utils/i18n/getErrorMessage";

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
      const data = await fetchImagesRequest(reference, referenceType, type);
      setImages(data);
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
