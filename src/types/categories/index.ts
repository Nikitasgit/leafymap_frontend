import { BaseEntity } from "../common";
import { PlaceType } from "../place/placeCaterories";

export interface SubCategory extends BaseEntity {
  name: string;
  category: Category;
}

export interface Category extends BaseEntity {
  name: string;
}

export interface PlaceCategory extends BaseEntity {
  name: string;
  description: string;
  types?: PlaceType[];
}
