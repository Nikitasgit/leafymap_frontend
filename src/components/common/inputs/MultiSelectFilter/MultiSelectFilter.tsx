import Autocomplete from "@mui/material/Autocomplete";
import MuiTextField from "@mui/material/TextField";
import ListSubheader from "@mui/material/ListSubheader";
import styles from "./MultiSelectFilter.module.scss";
import { MultiSelectFilterProps, MultiSelectOption } from "./MultiSelectFilter.types";

const MultiSelectFilter = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  groupBy,
  disabled,
  loading,
}: MultiSelectFilterProps) => {
  return (
    <div className={styles.wrapper}>
      <Autocomplete
        multiple
        value={value}
        onChange={(_e, newValue) => onChange(newValue)}
        options={options}
        getOptionLabel={(opt) => opt.label}
        groupBy={groupBy}
        filterSelectedOptions
        isOptionEqualToValue={(opt, val) => opt._id === val._id}
        disabled={disabled}
        loading={loading}
        renderOption={(props, option) => {
          const { key: _key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
          return (
            <li key={option._id} {...rest}>
              {option.label}
            </li>
          );
        }}
        renderGroup={(params) => (
          <li key={`group-${params.key}`}>
            <ListSubheader component="div" disableSticky>
              {params.group}
            </ListSubheader>
            <ul style={{ padding: 0 }}>{params.children}</ul>
          </li>
        )}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label={label}
            placeholder={value.length === 0 ? placeholder : undefined}
            size="small"
          />
        )}
        slotProps={{
          popper: {
            placement: "bottom-start",
            modifiers: [{ name: "flip", enabled: false }],
            style: { zIndex: 100001 },
          },
          paper: {
            style: {
              maxHeight: "min(50vh, 260px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          },
          listbox: {
            style: { overflow: "auto", flex: "1 1 auto" },
          },
        }}
      />
    </div>
  );
};

export default MultiSelectFilter;
