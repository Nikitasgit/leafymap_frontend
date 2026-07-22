import React from "react";
import MuiTextField from "@mui/material/TextField";
import styles from "./TextField.module.scss";

type TextfieldProps = {
  label?: string;
  name: string;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  disabled?: boolean;
  fullWidth?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  readOnly?: boolean;
  className?: string;
  size?: "small" | "medium";
};

const TextField: React.FC<TextfieldProps> = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  type = "text",
  placeholder = "",
  readOnly = false,
  error = false,
  errorMessage,
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
  fullWidth = false,
  showCharCount = false,
  maxLength,
  className,
  size = "medium",
}) => {
  const charCount = value.length;
  const isOverLimit = maxLength !== undefined && charCount > maxLength;

  const field = (
    <MuiTextField
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      type={multiline ? undefined : type}
      multiline={multiline}
      minRows={multiline ? rows : undefined}
      required={required}
      disabled={disabled}
      error={error}
      helperText={error && errorMessage ? errorMessage : undefined}
      fullWidth={fullWidth}
      size={size}
      className={multiline && showCharCount ? styles.withCharCount : undefined}
      slotProps={{
        htmlInput: {
          readOnly,
          maxLength,
          onClick,
          onKeyDown,
        },
      }}
    />
  );

  return (
    <div
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
    >
      {multiline && showCharCount ? (
        <div className={styles.textareaWrapper}>
          {field}
          <div
            className={`${styles.charCount} ${
              isOverLimit ? styles.overLimit : ""
            }`}
          >
            {charCount}
            {maxLength !== undefined && ` / ${maxLength}`}
          </div>
        </div>
      ) : (
        field
      )}
    </div>
  );
};

export default TextField;
