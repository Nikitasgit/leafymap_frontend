export type CreatorSearchResult = {
  _id: string;
  name: string;
  image: string;
  categories?: {
    name: string;
    userCategoryType?: "creation" | "organization";
  }[];
};

export type LocationSearchResult = {
  _id: string;
  name: string;
  coordinates?: number[];
};

export type SearchResult = {
  id: string;
  type: "creator" | "filters" | null;
};

export type SearchType = {
  label: string;
  placeholder: string;
};

import { MapFilters, ExtendedMapRef } from "@/types/map";

export type MapFiltersBarProps = {
  mapRef: React.RefObject<ExtendedMapRef | null>;
  loading: boolean;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  handleSelect: (item: SearchResult) => void;
  selectedItem: SearchResult;
};
