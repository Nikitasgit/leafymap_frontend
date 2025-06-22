import React, { useState, useEffect } from "react";
import { PlaceType } from "@/types/place/placeCaterories";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import styles from "./PlaceTypeSelectorInput.module.scss";

interface PlaceTypeSelectorInputProps {
  value: PlaceType[];
  onChange: FormDataChangeHandler;
}

const PlaceTypeSelectorInput: React.FC<PlaceTypeSelectorInputProps> = ({
  value = [],
  onChange,
}) => {
  const [selectedTypes, setSelectedTypes] = useState<PlaceType[]>(value);

  const placeTypes: { value: PlaceType; label: string; icon: string }[] = [
    { value: "food", label: "Alimentation", icon: "🍽️" },
    { value: "art", label: "Art", icon: "🎨" },
    { value: "craft", label: "Artisanat", icon: "🔨" },
  ];

  useEffect(() => {
    setSelectedTypes(value);
  }, [value]);

  const handleTypeToggle = (type: PlaceType) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newSelectedTypes);
    // Envoyer tous les types sélectionnés au backend
    onChange({
      target: {
        name: "placeType",
        value: newSelectedTypes,
      },
    });
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        Sélectionner un ou plusieurs types correspondant à votre activité
      </label>
      <div className={styles.optionsContainer}>
        {placeTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            className={`${styles.option} ${
              selectedTypes.includes(type.value) ? styles.selected : ""
            }`}
            onClick={() => handleTypeToggle(type.value)}
          >
            <span className={styles.icon}>{type.icon}</span>
            <span className={styles.label}>{type.label}</span>
            {selectedTypes.includes(type.value) && (
              <span className={styles.checkmark}>✓</span>
            )}
          </button>
        ))}
      </div>
      {selectedTypes.length > 0 && (
        <div className={styles.selectedInfo}>
          Types sélectionnés : {selectedTypes.length}
        </div>
      )}
    </div>
  );
};

export default PlaceTypeSelectorInput;
