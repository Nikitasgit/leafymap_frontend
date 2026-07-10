import { useMemo, useRef, useState } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";
import { PlaceCategory } from "@/types/categories";
import TextField from "../../common/inputs/TextField";
import { useApp } from "@/hooks/useApp";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import LoadingBar from "../../common/loading/LoadingBar";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

const PlaceCategorySelectorInput = ({
  value,
  onChange,
  error = false,
  errorMessage = "",
}: {
  value: string;
  onChange: FormDataChangeHandler;
  error?: boolean;
  errorMessage?: string;
}) => {
  const { placeCategories, loading, error: appError } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const { showError } = useToast();
  const { t } = useTranslation("subscription");
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const inputValue = useMemo(() => {
    if (!value) return "";
    return placeCategories.find((category) => category._id === value)?.name ?? "";
  }, [placeCategories, value]);

  const handleSelect = (category: PlaceCategory) => {
    setIsOpen(false);
    onChange({
      target: {
        name: "placeCategory",
        value: category._id,
      },
    });
  };

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
        onChange={() => {}}
        error={error}
        errorMessage={errorMessage}
      />

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.list}>
            {placeCategories.map((cat) => (
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
