import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useSelector } from "react-redux";
import { selectSubCategories } from "@/store/appSlice";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { SubCategory } from "@/types/categories";

const CategorySelectorInput = ({
  onChange,
  value,
}: {
  onChange: FormDataChangeHandler;
  value: string;
}) => {
  const subCategories = useSelector(selectSubCategories);

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

  const handleSelect = (subCategory: SubCategory) => {
    setInputValue(subCategory.name);
    setIsOpen(false);
    setSearch("");
    onChange({
      target: {
        name: "category",
        value: subCategory._id,
      },
    });
  };

  const filteredSubcategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (value) {
      const sub = subCategories.find((s) => s._id === value);
      if (sub) {
        setInputValue(sub.name);
      }
    }
  }, [value, subCategories]);

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      <input
        type="text"
        value={inputValue}
        onClick={() => setIsOpen(true)}
        readOnly
        placeholder="Sélectionne une activité"
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBar}
          />

          <div className={styles.list}>
            {filteredSubcategories.map((sub) => (
              <div
                key={sub._id}
                className={styles.item}
                onClick={() => handleSelect(sub)}
              >
                {sub.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelectorInput;
