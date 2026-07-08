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
