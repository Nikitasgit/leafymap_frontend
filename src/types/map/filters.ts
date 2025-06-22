import { PlaceCategory } from "../place/placeCaterories";

export type MapFilters = {
  placeType: string[];
  placeCategory: "all" | PlaceCategory;
};
