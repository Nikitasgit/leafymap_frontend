import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { Image } from "@/types/image";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/utils/i18n/getErrorMessage";

export const useImages = (
  reference: string | null,
  referenceType: "Place" | "User" | "Event" | "Message" | "Review" | null,
  type?: "profile" | "cover" | "gallery" | "other"
) => {
  const [images, setImages] = useState<Image[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();
  const { t } = useTranslation("account");

  const fetchImages = async () => {
    try {
      let url = `/api/images/?reference=${reference}&referenceType=${referenceType}`;

      if (type) {
        url += `&type=${type}`;
      }

      const response = await apiClient.get(url, {
      });

      if (response.data && response.data.data && response.data.data.images) {
        setImages(response.data.data.images);
      } else {
        setImages([]);
        showError(t("useImages.invalidResponse"));
      }
    } catch (err) {
      showError(
        getErrorMessage(err, t, t("useImages.loadError")),
      );
      setImages([]);
    }
  };

  const refetch = async () => {
    if (reference && referenceType) {
      await withLoading(fetchImages);
    }
  };

  useEffect(() => {
    if (reference && referenceType) {
      withLoading(fetchImages);
    } else {
      setImages([]);
      stopLoading();
    }
  }, [reference, referenceType, type]);

  return { images, isLoading, refetch };
};
