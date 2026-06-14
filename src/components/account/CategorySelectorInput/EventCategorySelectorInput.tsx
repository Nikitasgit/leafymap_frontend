import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventCategory } from "@/types/categories";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper/CreateProfileStepper.types";
import { useApp } from "@/hooks/useApp";
import { useToast } from "@/hooks/useToast";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import LoadingBar from "../../common/loading/LoadingBar/LoadingBar";
import TextField from "../../common/inputs/TextField/TextField";
import styles from "./CategorySelectorInput.module.scss";

const EventCategorySelectorInput = ({
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
  const { eventCategories, loading, error: appError } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { showError } = useToast();
  const { t } = useTranslation(["subscription", "common"]);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleSelect = (eventCategory: EventCategory) => {
    setInputValue(eventCategory.name);
    setIsOpen(false);
    onChange({
      target: {
        name: "eventCategory",
        value: eventCategory._id,
      },
    });
  };

  useEffect(() => {
    if (!value) {
      setInputValue("");
      return;
    }

    const category = eventCategories.find((cat) => cat._id === value);
    if (category) {
      setInputValue(category.name);
    }
  }, [eventCategories, value]);

  if (appError) {
    showError(appError);
  }

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      {loading && <LoadingBar />}
      <TextField
        name="eventCategory"
        label={t("subscription:eventCategorySelector.label")}
        value={t(`common:eventCategories.${inputValue}`, {
          defaultValue: inputValue,
        })}
        onClick={() => setIsOpen(true)}
        readOnly
        required
        fullWidth
        placeholder={t("subscription:eventCategorySelector.placeholder")}
        onChange={(e) => setInputValue(e.target.value)}
        error={error}
        errorMessage={errorMessage}
      />

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.list}>
            {eventCategories.map((cat) => (
              <li key={cat._id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(cat)}
                  role="option"
                  aria-selected={value === cat._id}
                >
                  {t(`common:eventCategories.${cat.name}`, {
                    defaultValue: cat.name,
                  })}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventCategorySelectorInput;
