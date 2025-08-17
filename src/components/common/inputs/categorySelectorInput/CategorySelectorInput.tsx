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
  onChange,
  value,
  error = false,
}: {
  onChange: FormDataChangeHandler;
  value: string[];
  error?: boolean;
}) => {
  const { subCategories, loading, error: appError } = useApp();

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
    onChange({
      target: {
        name: "categories",
        value: [subCategory._id],
      },
    });
  };

  const filteredSubcategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (value) {
      const sub = subCategories.find((s) => value.includes(s._id));
      if (sub) {
        setInputValue(sub.name);
      }
    }
  }, [value, subCategories]);

  if (appError) {
    showError(appError);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="categories"
        label={t("categorySelector.label")}
        readOnly
        fullWidth
        onChange={(e) => setInputValue(e.target.value)}
        value={t(`creatorCategories.${inputValue}`, {
          defaultValue: inputValue,
        })}
        onClick={() => setIsOpen(true)}
        placeholder={t("categorySelector.placeholder")}
        error={error}
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
