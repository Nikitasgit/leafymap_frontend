import { request } from "@/shared/api/client";
import type {
  CategoryType,
  EventCategory,
  PlaceCategory,
  UserCategory,
} from "@/shared/types/categories";

export interface CategoriesResponse {
  categoryTypes: CategoryType[];
  userCategories: UserCategory[];
  placeCategories: PlaceCategory[];
  productCategories: Array<{
    id: string;
    name: string;
    type: string | { id: string; name: string };
  }>;
  eventCategories: EventCategory[];
}

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  return request<CategoriesResponse>({
    method: "GET",
    url: `/api/categories`,
  });
};
