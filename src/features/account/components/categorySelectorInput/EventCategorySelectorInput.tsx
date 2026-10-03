"use client";

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormDataChangeHandler } from "../createProfileStepper";
import { useApp } from "@/features/categories";
import { useToast } from "@/shared/hooks/useToast";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import SearchableSelect, {
  SelectOption,
} from "@/shared/ui/inputs/searchableSelect";

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
  const { showError } = useToast();
  const { t } = useTranslation("subscription");

  const options = useMemo<SelectOption[]>(
    () =>
      eventCategories.map((category) => ({
        id: category.id,
        label: t(`common:eventCategories.${category.name}`, {
          defaultValue: category.name,
        }),
      })),
    [eventCategories, t],
  );

  const selectedOption = options.find((option) => option.id === value) ?? null;

  const handleSelect = (selected: SelectOption | null) => {
    onChange({
      target: {
        name: "eventCategory",
        value: selected?.id ?? "",
      },
    });
  };

  useEffect(() => {
    if (appError) {
      showError(appError);
    }
  }, [appError, showError]);

  return (
    <>
      {loading && <LoadingBar />}
      <SearchableSelect
        name="eventCategory"
        label={t("eventCategorySelector.label")}
        required
        options={options}
        value={selectedOption}
        onChange={handleSelect}
        loading={loading}
        placeholder={t("eventCategorySelector.searchPlaceholder")}
        error={error}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default EventCategorySelectorInput;
