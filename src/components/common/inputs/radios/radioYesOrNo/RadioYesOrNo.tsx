import React from "react";
import styles from "./RadioYesOrNo.module.scss";

type RadioYesOrNoProps = {
  name: string;
  title?: string;
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  yesLabel?: string;
  noLabel?: string;
  disabled?: boolean;
};

const RadioYesOrNo: React.FC<RadioYesOrNoProps> = ({
  name,
  label,
  title,
  value,
  onChange,
  yesLabel = "Oui",
  noLabel = "Non",
  disabled = false,
}) => {
  return (
    <div>
      {title && <p className={styles.title}>{title}</p>}
      <div className={styles.container}>
        {label && <p className={styles.label}>{label}</p>}
        <div className={styles.optionsContainer}>
          <div className={styles.optionWrapper}>
            <input
              type="radio"
              id={`${name}-yes`}
              name={name}
              value="yes"
              checked={value === "yes"}
              onChange={onChange}
              disabled={disabled}
              className={styles.radioInput}
            />
            <label htmlFor={`${name}-yes`} className={styles.radioLabel}>
              <span className={styles.optionText}>{yesLabel}</span>
            </label>
          </div>

          <div className={styles.optionWrapper}>
            <input
              type="radio"
              id={`${name}-no`}
              name={name}
              value="no"
              checked={value === "no"}
              onChange={onChange}
              disabled={disabled}
              className={styles.radioInput}
            />
            <label htmlFor={`${name}-no`} className={styles.radioLabel}>
              <span className={styles.optionText}>{noLabel}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioYesOrNo;
