import React from "react";
import Link from "next/link";
import styles from "./CGUCheckbox.module.scss";

export interface CGUCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  cguLink?: string;
  className?: string;
}

export const CGUCheckbox: React.FC<CGUCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  cguLink = "/legal/cgu",
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`${styles.checkboxGroup} ${className || ""}`}>
      <label className={styles.checkboxLabel} htmlFor="cgu">
        <input
          type="checkbox"
          id="cgu"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.checkbox}
          aria-required="true"
          aria-describedby={error ? "cgu-error" : undefined}
        />
        <span className={styles.checkboxText}>
          J&apos;accepte les{" "}
          <Link
            href={cguLink}
            className={styles.cguLink}
            aria-label="Lire les Conditions Générales d'Utilisation"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conditions Générales d&apos;Utilisation
          </Link>
        </span>
      </label>
      {error && errorMessage && (
        <span
          className={styles.errorMessage}
          id="cgu-error"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default CGUCheckbox;
