export interface SearchInputProps<T> {
  value?: string;
  onSelect: (suggestion: T) => void;
  fetchSuggestions: (input: string) => Promise<T[]>;
  initialSuggestions?: T[];
  placeholder?: string;
  limit?: number;
  withIcons?: boolean;
  loading?: boolean;
  debounce?: number;
  label?: string;
}

export interface SearchSuggestion {
  _id: string;
  username?: string;
  name?: string;
  image?: string;
  location?: { label: string };
  status?: string;
  categories?: { name: string }[];
}

export type SearchInputGeneric<T extends SearchSuggestion> =
  SearchInputProps<T>;
