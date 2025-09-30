export type CreatorSearchResult = {
  _id: string;
  name: string;
  image: string;
};

export type PlaceSearchResult = {
  _id: string;
  name: string;
  image?: string;
  location: {
    label: string;
  };
  placeCategory: {
    _id: string;
    name: string;
  };
};

export type SearchResult = {
  id: string;
  type: "user" | "place" | "filters" | null;
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
