"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventCategory } from "@/shared/types/categories";
import { FormDataChangeHandler } from "../createProfileStepper";
import { useApp } from "@/features/categories";
import { useToast } from "@/shared/hooks/useToast";
import useOnClickOutside from "@/shared/hooks/useOnClickOutside";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import TextField from "@/shared/ui/inputs/textField";
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
  const [isOpen, setIsOpen] = useState(false);
  const { showError } = useToast();
  const { t } = useTranslation("subscription");
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const inputValue = useMemo(() => {
    if (!value) return "";
    return eventCategories.find((cat) => cat.id === value)?.name ?? "";
  }, [eventCategories, value]);

  const handleSelect = (eventCategory: EventCategory) => {
    setIsOpen(false);
    onChange({
      target: {
        name: "eventCategory",
        value: eventCategory.id,
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
        name="eventCategory"
        label={t("eventCategorySelector.label")}
        value={t(`common:eventCategories.${inputValue}`, {
          defaultValue: inputValue,
        })}
        onClick={() => setIsOpen(true)}
        readOnly
        required
        fullWidth
        placeholder={t("eventCategorySelector.placeholder")}
        onChange={() => {}}
        error={error}
        errorMessage={errorMessage}
      />

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.list}>
            {eventCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => handleSelect(cat)}
                  role="option"
                  aria-selected={value === cat.id}
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
