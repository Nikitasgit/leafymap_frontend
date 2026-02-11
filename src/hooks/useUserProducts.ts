import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { Product } from "@/types/product";

export const useUserProducts = (userId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);
  showErrorRef.current = showError;

  const fetchProducts = useCallback(async () => {
    if (!userId) {
      setProducts([]);
      return;
    }
    try {
      const params = new URLSearchParams({ userId });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`,
        { withCredentials: true }
      );
      const data = response.data?.data ?? [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des produits";
      setProducts([]);
      showErrorRef.current(message);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      withLoading(fetchProducts);
    } else {
      setProducts([]);
    }
  }, [userId, fetchProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    isLoading,
    refetch: fetchProducts,
  };
};
