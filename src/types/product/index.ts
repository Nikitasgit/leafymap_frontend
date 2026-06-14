import { BaseEntity } from "../common";

export interface CategoryTypeRef {
  _id: string;
  name: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  type: string | CategoryTypeRef;
}

export interface Product extends BaseEntity {
  productCategory: string | ProductCategory;
  user: string;
}

export interface ProductPopulated extends BaseEntity {
  productCategory: ProductCategory & { type: CategoryTypeRef };
  user: string;
}
