import { BaseEntity } from "../common";
import { PlaceType } from "../place/placeCaterories";

export interface UserCategory extends BaseEntity {
  _id: string;
  name: string;
  category: Category;
  userCategoryType: "creation" | "organization";
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
