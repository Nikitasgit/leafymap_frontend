import { useState, useEffect, useCallback } from "react";
import { useLoading } from "@/shared/hooks/useLoading";
import { useToast } from "@/shared/hooks/useToast";
import type { Product } from "../types";
import { getUserProducts } from "../api/productsApi";

export const useUserProducts = (userId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();

  const fetchProducts = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      const data = await getUserProducts(userId);
      setProducts(data);
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

export default useUserProducts;
