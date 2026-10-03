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
  const { showError } = useToast();
  const { t } = useTranslation("subscription");

  const options = useMemo<SelectOption[]>(
    () =>
      placeCategories.map((category) => ({
        id: category.id,
        label: t(`placeCategories.${category.name}`, {
          defaultValue: category.name,
        }),
      })),
    [placeCategories, t],
  );

  const selectedOption = options.find((option) => option.id === value) ?? null;

  const handleSelect = (selected: SelectOption | null) => {
    onChange({
      target: {
        name: "placeCategory",
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
        name="placeCategory"
        label={t("placeCategorySelector.label")}
        required
        options={options}
        value={selectedOption}
        onChange={handleSelect}
        loading={loading}
        placeholder={t("placeCategorySelector.searchPlaceholder")}
        error={error}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default PlaceCategorySelectorInput;
