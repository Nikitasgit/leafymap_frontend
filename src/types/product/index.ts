import { BaseEntity } from "../common";

export interface CategoryRef {
  _id: string;
  name: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  category: string | CategoryRef;
}

export interface Product extends BaseEntity {
  productCategory: string | ProductCategory;
  user: string;
}

export interface ProductPopulated extends BaseEntity {
  productCategory: ProductCategory & { category: CategoryRef };
  user: string;
}
