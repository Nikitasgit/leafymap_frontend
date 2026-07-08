"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "@/hooks/useApp";
import { PlaceTypeSelectorInputProps } from "./PlaceTypeSelectorInput.types";
import styles from "./PlaceTypeSelectorInput.module.scss";

const PlaceTypeSelectorInput: React.FC<PlaceTypeSelectorInputProps> = ({
  value,
  onChange,
  error = false,
}) => {
  const { t } = useTranslation("subscription");
  const { categoryTypes } = useApp();

  const placeCategoryTypes = categoryTypes.filter(
    (type) => type.name !== "organization",
  );

  const handleToggle = (typeId: string) => {
    const isSelected = value.includes(typeId);
    const nextValue = isSelected
      ? value.filter((id) => id !== typeId)
      : [...value, typeId];

    onChange({
      target: {
        name: "placeType",
        value: nextValue,
      },
    });
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t("placeTypeSelector.label")}</label>
      <div className={styles.optionsContainer}>
        {placeCategoryTypes.map((type) => {
          const isSelected = value.includes(type._id);
          const label = t(`placeTypes.${type.name}`, {
            defaultValue: type.name,
          });

          return (
            <button
              key={type._id}
              type="button"
              className={`${styles.option} ${isSelected ? styles.selected : ""} ${error ? styles.error : ""}`}
              onClick={() => handleToggle(type._id)}
            >
              <span className={styles.label}>{label}</span>
              {isSelected && <span className={styles.checkmark}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlaceTypeSelectorInput;
