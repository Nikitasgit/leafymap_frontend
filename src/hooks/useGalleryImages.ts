import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "@/types/image";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export const useGalleryImages = (
  reference: string | null,
  referenceType: "Place" | "User" | "Event" | "Message" | "Review" | null
) => {
  const [images, setImages] = useState<Image[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchGalleryImages = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/images/gallery?reference=${reference}&referenceType=${referenceType}`;

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
          : "Erreur lors du chargement des images de la galerie";
      setImages([]);
      showError(errorMessage);
    }
  };

  const refetch = async () => {
    if (reference && referenceType) {
      await withLoading(fetchGalleryImages);
    }
  };

  useEffect(() => {
    if (reference && referenceType) {
      withLoading(fetchGalleryImages);
    } else {
      setImages([]);
      stopLoading();
    }
  }, [reference, referenceType]);

  return { images, isLoading, refetch };
};
