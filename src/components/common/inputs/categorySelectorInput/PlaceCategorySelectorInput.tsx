import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useSelector } from "react-redux";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { selectPlaceCategories } from "@/store/appSlice";
import { PlaceCategory } from "@/types/categories";

const PlaceCategorySelectorInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: FormDataChangeHandler;
}) => {
  const placeCategories = useSelector(selectPlaceCategories);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const filtered = placeCategories.filter((cat) =>
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
  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      <input
        type="text"
        value={inputValue}
        onClick={() => setIsOpen(true)}
        readOnly
        placeholder="Sélectionne un type de lieu"
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="text"
            placeholder="Rechercher un lieu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBar}
          />

          <div className={styles.list}>
            {filtered.map((cat) => (
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
