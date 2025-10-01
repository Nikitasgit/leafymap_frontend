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
  errorMessage,
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
  fullWidth = false,
  showCharCount = false,
  maxLength,
  className,
}) => {
  const charCount = value.length;
  const isOverLimit = maxLength && charCount > maxLength;

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}{" "}
          {required ? (
            <span aria-hidden="true">*</span>
          ) : (
            <span className={styles.srOnly}>(optionnel)</span>
          )}
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
            className={`${error ? styles.error : ""} ${
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
          className={`${error ? styles.error : ""} ${
            fullWidth ? styles.fullWidth : ""
          }`}
        />
      )}
      {error && errorMessage && (
        <div className={styles.errorMessage} role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default TextField;
