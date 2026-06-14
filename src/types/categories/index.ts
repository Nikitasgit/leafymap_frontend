import { BaseEntity } from "../common";

export interface UserCategory extends BaseEntity {
  _id: string;
  name: string;
  type: CategoryType;
}

export interface CategoryType extends BaseEntity {
  _id: string;
  name: string;
}

export interface PlaceCategory extends BaseEntity {
  _id: string;
  name: string;
  types?: Array<CategoryType | string>;
}

export interface EventCategory extends BaseEntity {
  _id: string;
  name: string;
}
