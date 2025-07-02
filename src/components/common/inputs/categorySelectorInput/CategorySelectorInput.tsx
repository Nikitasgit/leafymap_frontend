import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useApp } from "@/hooks/useApp";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { SubCategory } from "@/types/categories";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useToast } from "@/hooks/useToast";
import LoadingBar from "../../loading/LoadingBar";
import TextField from "../textField/TextField";

const CategorySelectorInput = ({
  onChange,
  value,
}: {
  onChange: FormDataChangeHandler;
  value: string;
}) => {
  const { subCategories, loading, error } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { showError } = useToast();

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setIsOpen(false);
    setSearch("");
  };

  useOnClickOutside(ref, handleClickOutside);

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

  if (error) {
    showError(error);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="category"
        label="Activité"
        readOnly
        fullWidth
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        onClick={() => setIsOpen(true)}
        placeholder="Sélectionne une activité"
      />
      {isOpen && (
        <div className={styles.dropdown}>
          <TextField
            type="text"
            name="search"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setIsOpen(true)}
            fullWidth
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
