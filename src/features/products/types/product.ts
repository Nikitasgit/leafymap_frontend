import type { BaseEntity } from "@/shared/types/common";

export interface CategoryTypeRef {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  type: string | CategoryTypeRef;
}

export interface Product extends BaseEntity {
  productCategory: string | ProductCategory;
  user: string;
}
