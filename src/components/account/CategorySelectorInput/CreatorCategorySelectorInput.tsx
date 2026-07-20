import { useEffect, useMemo } from "react";
import { useApp } from "@/hooks/useApp";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";
import { useToast } from "@/hooks/useToast";
import LoadingBar from "../../common/loading/LoadingBar";
import SearchableSelect, {
  SelectOption,
} from "../../common/inputs/SearchableSelect";
import { useTranslation } from "react-i18next";

const CategorySelectorInput = ({
  onUserChange,
  value,
  error = false,
  errorMessage = "",
}: {
  onUserChange: FormDataChangeHandler;
  value: string;
  error?: boolean;
  errorMessage?: string;
}) => {
  const { userCategories, loading, error: appError } = useApp();
  const { t } = useTranslation("subscription");

  const { showError } = useToast();

  const options = useMemo<SelectOption[]>(
    () =>
      userCategories.map((userCategory) => ({
        id: userCategory.id,
        label: t(`common:creatorCategories.${userCategory.name}`, {
          defaultValue: userCategory.name,
        }),
      })),
    [t, userCategories],
  );

  const selectedOption =
    options.find((option) => option.id === value) ?? null;

  const handleSelect = (selected: SelectOption | null) => {
    const userCategory = selected
      ? userCategories.find((category) => category.id === selected.id)
      : null;

    onUserChange({
      target: {
        name: "userCategory",
        value: userCategory?.id ?? "",
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
        name="userCategory"
        label={t("categorySelector.label")}
        required
        options={options}
        value={selectedOption}
        onChange={handleSelect}
        loading={loading}
        placeholder={t("categorySelector.searchPlaceholder")}
        error={error}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default CategorySelectorInput;
