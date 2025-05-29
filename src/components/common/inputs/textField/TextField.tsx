import React from "react";

type TextfieldProps = {
  label?: string;
  name: string;
  value: string;
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
};

const TextField: React.FC<TextfieldProps> = ({
  label,
  name,
  value,
  onChange,
  onClick,
  type = "text",
  placeholder = "",
  error = false,
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onClick={onClick}
          rows={rows}
          className={error ? "error" : ""}
        />
      ) : (
        <input
          id={name}
          name={name}
          disabled={disabled}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          onClick={onClick}
          className={error ? "error" : ""}
        />
      )}
    </div>
  );
};

export default TextField;
