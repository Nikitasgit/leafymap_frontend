import { BaseEntity } from "../common";
import { PlaceType } from "../place/placeCaterories";

export interface SubCategory extends BaseEntity {
  _id: string;
  name: string;
  category: Category;
}


export interface Category extends BaseEntity {
  _id: string;
  name: string;
}

export interface PlaceCategory extends BaseEntity {
  _id: string;
  name: string;
  description: string;
  types?: PlaceType[];
}
