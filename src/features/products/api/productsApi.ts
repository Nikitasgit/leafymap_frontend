import { request } from "@/shared/api/client";
import type { Product } from "../types";

const baseUrl = `/api/products`;

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  const params = new URLSearchParams({ userId });
  const data = await request<Product[]>({
    method: "GET",
    url: `${baseUrl}?${params.toString()}`,
  });
  return Array.isArray(data) ? data : [];
};

export const createProduct = async (data: {
  productCategory: string;
}): Promise<Product | true> => {
  const result = await request<Product | undefined>({
    method: "POST",
    url: baseUrl,
    data,
  });
  return result ?? true;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await request<void>({ method: "DELETE", url: `${baseUrl}/${productId}` });
};
