import { BaseEntity } from "../common";

export interface SubCategory extends BaseEntity {
  name: string;
  categoryId: string;
}

export interface Category extends BaseEntity {
  name: string;
  subCategories: SubCategory[];
}

export interface PlaceCategory extends BaseEntity {
  name: string;
  description: string;
}
