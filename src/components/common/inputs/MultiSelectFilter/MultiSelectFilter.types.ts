export interface MultiSelectOption {
  id: string;
  label: string;
  group?: string;
}

export interface MultiSelectFilterProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (selected: MultiSelectOption[]) => void;
  label: string;
  placeholder?: string;
  groupBy?: (option: MultiSelectOption) => string;
  disabled?: boolean;
  loading?: boolean;
}
