import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "@/types/image";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useImages = (
  reference: string | null,
  referenceType: "Place" | "User" | "Event" | "Message" | "Review" | null,
  type?: "profile" | "cover" | "gallery" | "other"
) => {
  const [images, setImages] = useState<Image[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchImages = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/images/?reference=${reference}&referenceType=${referenceType}`;

      if (type) {
        url += `&type=${type}`;
      }

      const response = await axios.get(url, {
        withCredentials: true,
      });

      if (response.data && response.data.data && response.data.data.images) {
        setImages(response.data.data.images);
      } else {
        setImages([]);
        showError("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des images";
      setImages([]);
      showError(errorMessage);
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
