import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { PlaceCategory } from "@/types/categories";
import { PlaceType } from "@/types/place/placeCaterories";
import TextField from "../textField/TextField";
import { useApp } from "@/hooks/useApp";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import LoadingBar from "../../loading/LoadingBar";
import { useToast } from "@/hooks/useToast";

const PlaceCategorySelectorInput = ({
  value,
  onChange,
  selectedTypes = [],
}: {
  value: string;
  onChange: FormDataChangeHandler;
  selectedTypes?: PlaceType[];
}) => {
  const { placeCategories, loading, error } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { showError } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  const getFilteredCategories = () => {
    if (selectedTypes.length === 0) {
      return placeCategories;
    }

    const filtered = placeCategories.filter((category) => {
      const categoryTypes = category.types || [];
      return (
        categoryTypes.length > 0 &&
        categoryTypes.some((type: PlaceType) => selectedTypes.includes(type))
      );
    });

    return filtered;
  };

  const isCurrentCategoryCompatible = () => {
    if (!value || selectedTypes.length === 0) {
      return true;
    }

    const currentCategory = placeCategories.find((cat) => cat._id === value);
    if (!currentCategory) {
      return false;
    }

    const categoryTypes = currentCategory.types || [];
    return (
      categoryTypes.length > 0 &&
      categoryTypes.some((type: PlaceType) => selectedTypes.includes(type))
    );
  };

  useEffect(() => {
    if (value && !isCurrentCategoryCompatible()) {
      setInputValue("");
      onChange({
        target: {
          name: "placeCategory",
          value: "",
        },
      });
    }
  }, [selectedTypes, value, onChange]);

  const handleClickOutside = () => {
    setIsOpen(false);
    setSearch("");
  };

  useOnClickOutside(ref, handleClickOutside);

  const handleSelect = (category: PlaceCategory) => {
    setInputValue(category.name);
    setIsOpen(false);
    setSearch("");
    onChange({
      target: {
        name: "placeCategory",
        value: category._id,
      },
    });
  };

  const filteredCategories = getFilteredCategories();
  const searchFiltered = filteredCategories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (value) {
      const category = placeCategories.find((s) => s._id === value);
      if (category) {
        setInputValue(category.name);
      }
    }
  }, [value, placeCategories]);

  if (error) {
    showError(error);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="placeCategory"
        label="Type de lieu"
        value={inputValue}
        onClick={() => setIsOpen(true)}
        readOnly
        required
        fullWidth
        placeholder="Sélectionne un type de lieu"
        onChange={(e) => setInputValue(e.target.value)}
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <TextField
            name="search"
            onClick={() => setIsOpen(true)}
            placeholder="Rechercher un lieu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <div className={styles.list}>
            {searchFiltered.map((cat) => (
              <div
                key={cat._id}
                className={styles.item}
                onClick={() => handleSelect(cat)}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceCategorySelectorInput;
