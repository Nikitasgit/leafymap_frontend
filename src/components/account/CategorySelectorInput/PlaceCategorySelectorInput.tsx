import { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import { PlaceCategory } from "@/types/categories";
import { PlaceType } from "@/types/place/placeCaterories";
import TextField from "../../common/inputs/textField/TextField";
import { useApp } from "@/hooks/useApp";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import LoadingBar from "../../common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

const PlaceCategorySelectorInput = ({
  value,
  onChange,
  selectedTypes = [],
  error = false,
  errorMessage = "",
}: {
  value: string;
  onChange: FormDataChangeHandler;
  selectedTypes?: PlaceType[];
  error?: boolean;
  errorMessage?: string;
}) => {
  const { placeCategories, loading, error: appError } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { showError } = useToast();
  const { t } = useTranslation("subscription");
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

  useEffect(() => {
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

    if (value && !isCurrentCategoryCompatible()) {
      setInputValue("");
      onChange({
        target: {
          name: "placeCategory",
          value: "",
        },
      });
    }
  }, [selectedTypes, value, onChange, placeCategories]);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const handleSelect = (category: PlaceCategory) => {
    setInputValue(category.name);
    setIsOpen(false);
    onChange({
      target: {
        name: "placeCategory",
        value: category._id,
      },
    });
  };

  const filteredCategories = getFilteredCategories();

  useEffect(() => {
    if (value) {
      const category = placeCategories.find((s) => s._id === value);
      if (category) {
        setInputValue(category.name);
      }
    }
  }, [value, placeCategories]);

  if (appError) {
    showError(appError);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="placeCategory"
        label={t("placeCategorySelector.label")}
        value={t(`placeCategories.${inputValue}`, {
          defaultValue: inputValue,
        })}
        onClick={() => setIsOpen(true)}
        readOnly
        required
        fullWidth
        placeholder={t("placeCategorySelector.placeholder")}
        onChange={(e) => setInputValue(e.target.value)}
        error={error}
        errorMessage={errorMessage}
      />

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.list}>
            {filteredCategories.map((cat) => (
              <li key={cat._id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(cat)}
                  role="option"
                  aria-selected={value === cat._id}
                >
                  {t(`placeCategories.${cat.name}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaceCategorySelectorInput;
