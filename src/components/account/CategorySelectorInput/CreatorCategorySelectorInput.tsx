import { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useApp } from "@/hooks/useApp";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import { UserCategory } from "@/types/categories";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useToast } from "@/hooks/useToast";
import LoadingBar from "../../common/loading/LoadingBar/LoadingBar";
import TextField from "../../common/inputs/TextField/TextField";
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
  value: string;
  error?: boolean;
  errorMessage?: string;
}) => {
  const { userCategories, loading, error: appError } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("subscription");

  const { showError } = useToast();

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const handleSelect = (userCategory: UserCategory) => {
    setInputValue(userCategory.name);
    setIsOpen(false);
    onUserChange({
      target: {
        name: "userCategories",
        value: [userCategory._id],
      },
    });
    onPlaceChange({
      target: {
        name: "placeType",
        value: [userCategory.category.name],
      },
    });
  };

  useEffect(() => {
    if (value) {
      const categoryId = value;
      if (categoryId) {
        const userCategory = userCategories.find(
          (cat) => cat._id === categoryId
        );
        if (userCategory) {
          setInputValue(userCategory.name);
        }
      }
    }
  }, [value, userCategories]);

  if (appError) {
    showError(appError);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="userCategories"
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
            {userCategories.map((sub) => (
              <li key={sub._id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(sub)}
                  role="option"
                  aria-selected={value === sub._id}
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
