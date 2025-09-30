export interface SearchInputProps<T> {
  value?: string;
  onSelect: (suggestion: T) => void;
  fetchSuggestions: (input: string) => Promise<T[]>;
  placeholder?: string;
  limit?: number;
  withIcons?: boolean;
  label?: string;
}

export interface SearchSuggestion {
  _id: string;
  name: string;
  image?: string;
  location?: { label: string };
  categories?: { name: string }[];
}

export type SearchInputGeneric<T extends SearchSuggestion> =
  SearchInputProps<T>;
