import { BaseEntity } from "../common";

export interface UserCategory extends BaseEntity {
  id: string;
  name: string;
  type: CategoryType;
}

export interface CategoryType extends BaseEntity {
  id: string;
  name: string;
}

export interface PlaceCategory extends BaseEntity {
  id: string;
  name: string;
  types?: Array<CategoryType | string>;
}

export interface EventCategory extends BaseEntity {
  id: string;
  name: string;
}
