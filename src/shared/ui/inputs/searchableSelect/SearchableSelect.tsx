import Autocomplete, {
  createFilterOptions,
} from "@mui/material/Autocomplete";
import type {
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import type { FilterOptionsState } from "@mui/material/useAutocomplete";
import MuiTextField from "@mui/material/TextField";
import ListSubheader from "@mui/material/ListSubheader";
import styles from "./SearchableSelect.module.scss";
import { SearchableSelectProps, SelectOption } from "./SearchableSelect.types";

const defaultFilter = createFilterOptions<SelectOption>();

const filterOptions = (
  options: SelectOption[],
  state: FilterOptionsState<SelectOption>,
  selected: SelectOption | SelectOption[] | null,
) => {
  const selectedLabels = Array.isArray(selected)
    ? selected.map((option) => option.label)
    : selected
      ? [selected.label]
      : [];

  if (selectedLabels.includes(state.inputValue)) {
    return options;
  }

  return defaultFilter(options, state);
};

const SearchableSelect = (props: SearchableSelectProps) => {
  const renderOption = (
    optionProps: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    option: SelectOption,
  ) => {
    const { key: _key, ...rest } = optionProps;

    return (
      <li key={option.id} {...rest}>
        {option.label}
      </li>
    );
  };

  const renderGroup = (params: AutocompleteRenderGroupParams) => (
    <li key={`group-${params.key}`}>
      <ListSubheader component="div" disableSticky>
        {params.group}
      </ListSubheader>
      <ul style={{ padding: 0 }}>{params.children}</ul>
    </li>
  );

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <MuiTextField
      {...params}
      label={props.label}
      name={props.name}
      placeholder={
        !props.multiple || props.value.length === 0
          ? props.placeholder
          : undefined
      }
      required={props.required}
      error={props.error}
      helperText={props.error ? props.errorMessage : undefined}
    />
  );

  const commonProps = {
    options: props.options,
    getOptionLabel: (option: SelectOption) => option.label,
    groupBy: props.groupBy,
    isOptionEqualToValue: (option: SelectOption, value: SelectOption) =>
      option.id === value.id,
    disabled: props.disabled,
    loading: props.loading,
    renderOption,
    renderGroup,
    renderInput,
    slotProps: {
      popper: {
        placement: "bottom-start" as const,
        modifiers: [{ name: "flip", enabled: false }],
        style: { zIndex: 100001 },
      },
      paper: {
        style: {
          maxHeight: "min(50vh, 260px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
        },
      },
      listbox: {
        style: { overflow: "auto", flex: "1 1 auto" },
      },
    },
  };

  return (
    <div className={styles.wrapper}>
      {props.multiple ? (
        <Autocomplete
          {...commonProps}
          multiple
          filterSelectedOptions
          openOnFocus
          selectOnFocus
          value={props.value}
          filterOptions={(options, state) =>
            filterOptions(options, state, props.value)
          }
          onChange={(_event, selected) => props.onChange(selected)}
        />
      ) : (
        <Autocomplete
          {...commonProps}
          openOnFocus
          selectOnFocus
          value={props.value}
          filterOptions={(options, state) =>
            filterOptions(options, state, props.value)
          }
          onChange={(_event, selected) => props.onChange(selected)}
        />
      )}
    </div>
  );
};

export default SearchableSelect;
