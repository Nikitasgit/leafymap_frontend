import { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useApp } from "@/hooks/useApp";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import { SubCategory } from "@/types/categories";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useToast } from "@/hooks/useToast";
import LoadingBar from "../../common/loading/LoadingBar";
import TextField from "../../common/inputs/textField/TextField";
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
  const { t } = useTranslation("subscription");

  const { showError } = useToast();

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const handleSelect = (subCategory: SubCategory) => {
    setInputValue(subCategory.name);
    setIsOpen(false);
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

  useEffect(() => {
    if (value && value.length > 0) {
      const categoryId = value[0];
      if (categoryId) {
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
  }, [value, creatorCategories, onPlaceChange]);

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
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.list}>
            {creatorCategories.map((sub) => (
              <li key={sub._id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(sub)}
                  role="option"
                  aria-selected={value.includes(sub._id)}
                >
                  {t(`creatorCategories.${sub.name}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySelectorInput;
