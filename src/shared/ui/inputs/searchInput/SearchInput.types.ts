import type { ReactNode } from "react";

export interface SearchInputProps<T> {
  value?: string;
  onSelect: (suggestion: T) => void;
  fetchSuggestions: (input: string) => Promise<T[]>;
  placeholder?: string;
  limit?: number;
  withIcons?: boolean;
  label?: string;
  size?: "small" | "medium";
  /** Renders a creator/user category badge next to the suggestion name. */
  renderCategoryBadge?: (categoryName: string) => ReactNode;
  /** Renders a place category badge next to the place label. */
  renderPlaceCategoryBadge?: (categoryName: string) => ReactNode;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  image?: string;
  googlePictureUrl?: string;
  location?: { label: string };
  categories?: {
    name: string;
    type?: {
      name: string;
    };
  }[];
  place?: {
    label: string;
    placeCategory: {
      name: string;
    };
  };
}
