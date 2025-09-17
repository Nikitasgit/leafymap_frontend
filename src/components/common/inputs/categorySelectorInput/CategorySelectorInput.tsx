import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useApp } from "@/hooks/useApp";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { SubCategory } from "@/types/categories";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useToast } from "@/hooks/useToast";
import LoadingBar from "../../loading/LoadingBar";
import TextField from "../textField/TextField";
import { useTranslation } from "react-i18next";

const CategorySelectorInput = ({
  onUserChange,
  onPlaceChange,
  value,
  error = false,
  errorMessage = "",
}: {
  onUserChange: FormDataChangeHandler;
  onPlaceChange: FormDataChangeHandler;
  value: string[];
  error?: boolean;
  errorMessage?: string;
}) => {
  const { creatorCategories, loading, error: appError } = useApp();

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation("subscription");

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
    onUserChange({
      target: {
        name: "creatorCategories",
        value: [subCategory._id],
      },
    });
    onPlaceChange({
      target: {
        name: "placeType",
        value: [subCategory.category.name],
      },
    });
  };

  const filteredSubcategories = creatorCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (value && value.length > 0) {
      const categoryId = value[0];
      if (categoryId) {
        // Find the SubCategory object by ID to get the name and category info
        const subCategory = creatorCategories.find(
          (cat) => cat._id === categoryId
        );
        if (subCategory) {
          setInputValue(subCategory.name);
          onPlaceChange({
            target: {
              name: "placeType",
              value: [subCategory.category.name],
            },
          });
        }
      }
    }
  }, [value, creatorCategories]);

  if (appError) {
    showError(appError);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="creatorCategories"
        label={t("categorySelector.label")}
        readOnly
        fullWidth
        required
        onChange={(e) => setInputValue(e.target.value)}
        value={t(`creatorCategories.${inputValue}`, {
          defaultValue: inputValue,
        })}
        onClick={() => setIsOpen(true)}
        placeholder={t("categorySelector.placeholder")}
        error={error}
        errorMessage={errorMessage}
      />
      {isOpen && (
        <div className={styles.dropdown}>
          <TextField
            type="text"
            name="search"
            placeholder={t("categorySelector.searchPlaceholder")}
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
                {t(`creatorCategories.${sub.name}`)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelectorInput;
