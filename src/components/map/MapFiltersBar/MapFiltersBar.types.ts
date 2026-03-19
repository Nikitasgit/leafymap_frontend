import { MapFilters, ExtendedMapRef } from "@/types/map";

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
  key: "membres" | "lieux";
  label: string;
  placeholder: string;
};

export type MapFiltersBarProps = {
  mapRef: React.RefObject<ExtendedMapRef | null>;
  loading: boolean;
  filters: MapFilters;
  handleSelect: (item: SearchResult) => void;
  selectedItem: SearchResult;
  isFavoritesMode: boolean;
  onFavoritesModeToggle: () => void;
  onExitFavoritesMode: () => void;
};
