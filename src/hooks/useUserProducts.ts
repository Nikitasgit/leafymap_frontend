import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Product } from "@/types/product";

export const useUserProducts = (userId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchProducts = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      const params = new URLSearchParams({ userId });
      const response = await apiClient.get(
        `/api/products?${params.toString()}`,
        {},
      );
      const data = response.data?.data ?? [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des produits";
      setProducts([]);
      showError(message);
    }
  }, [userId, showError]);

  useEffect(() => {
    if (!userId) return;
    void withLoading(fetchProducts);
  }, [userId, fetchProducts, withLoading]);

  return {
    products: userId ? products : [],
    isLoading,
    refetch: fetchProducts,
  };
};
