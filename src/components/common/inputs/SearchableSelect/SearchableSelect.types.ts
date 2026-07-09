export interface SelectOption {
  _id: string;
  label: string;
  group?: string;
}

interface SearchableSelectBaseProps {
  options: SelectOption[];
  label: string;
  placeholder?: string;
  groupBy?: (option: SelectOption) => string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  name?: string;
}

export type SearchableSelectProps =
  | (SearchableSelectBaseProps & {
      multiple?: false;
      value: SelectOption | null;
      onChange: (selected: SelectOption | null) => void;
    })
  | (SearchableSelectBaseProps & {
      multiple: true;
      value: SelectOption[];
      onChange: (selected: SelectOption[]) => void;
    });
