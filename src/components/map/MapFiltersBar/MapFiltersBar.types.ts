import { MapDisplayMode, MapFilters, ExtendedMapRef } from "@/types/map";

export type CreatorSearchResult = {
  id: string;
  name: string;
  image: string;
  categories?: {
    name: string;
    type?: {
      name: string;
    };
  }[];
};

export type LocationSearchResult = {
  id: string;
  name: string;
  coordinates?: number[];
};

export type EventSearchResult = {
  id: string;
  name: string;
  image?: string;
  creatorId: string;
  eventId: string;
  coordinates?: number[];
  location?: { label: string };
  categories?: {
    name: string;
  }[];
};

export type SearchResult = {
  id: string;
  type: "creator" | "filters" | null;
  eventId?: string | null;
};

export type SearchType = {
  key: "evenements" | "membres" | "lieux";
  label: string;
  placeholder: string;
};

export type MapFiltersBarProps = {
  mapRef: React.RefObject<ExtendedMapRef | null>;
  loading: boolean;
  filters: MapFilters;
  handleSelect: (item: SearchResult) => void;
  selectedItem: SearchResult;
  displayMode: MapDisplayMode;
  onDisplayModeChange: (mode: MapDisplayMode) => void;
  isFavoritesMode: boolean;
  onFavoritesModeToggle: () => void;
  onExitFavoritesMode: () => void;
};
