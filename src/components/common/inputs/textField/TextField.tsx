import React from "react";
import styles from "./TextField.module.scss";

type TextfieldProps = {
  label?: string;
  name: string;
  value: string;
  onFocus?: () => void;
  onClick?: () => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  error?: boolean;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  disabled?: boolean;
  fullWidth?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  readOnly?: boolean;
};

const TextField: React.FC<TextfieldProps> = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  onClick,
  type = "text",
  placeholder = "",
  readOnly = false,
  error = false,
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
  fullWidth = false,
  showCharCount = false,
  maxLength,
}) => {
  const charCount = value.length;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      {multiline ? (
        <div className={styles.textareaWrapper}>
          <textarea
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onClick={onClick}
            rows={rows}
            maxLength={maxLength}
            className={`${error ? "error" : ""} ${
              fullWidth ? styles.fullWidth : ""
            }`}
          />
          {showCharCount && (
            <div
              className={`${styles.charCount} ${
                isOverLimit ? styles.overLimit : ""
              }`}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
      ) : (
        <input
          id={name}
          name={name}
          readOnly={readOnly}
          disabled={disabled}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          onFocus={onFocus}
          onClick={onClick}
          maxLength={maxLength}
          className={`${error ? "error" : ""} ${
            fullWidth ? styles.fullWidth : ""
          }`}
        />
      )}
    </div>
  );
};

export default TextField;
