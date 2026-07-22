import { useMemo } from "react";
import { Tag } from "lucide-react";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/features/categories";
import { useTranslation } from "react-i18next";
import MultiSelectFilter from "@/shared/ui/inputs/multiSelectFilter";
import { MultiSelectOption } from "@/shared/ui/inputs/multiSelectFilter";
import styles from "./PlaceCategoryFilter.module.scss";
import { PlaceCategoryFilterProps } from "./PlaceCategoryFilter.types";

const PlaceCategoryFilter: React.FC<PlaceCategoryFilterProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const placeCategories = useAppSelector(selectPlaceCategories);
  const { t } = useTranslation("map");

  const options: MultiSelectOption[] = useMemo(
    () =>
      placeCategories.map((cat) => ({
        id: cat.id,
        label: t(`common:placeCategories.${cat.name.toLowerCase()}`, cat.name),
      })),
    [placeCategories, t]
  );

  const value = useMemo(
    () => options.filter((opt) => selectedCategories.includes(opt.id)),
    [options, selectedCategories]
  );

  const handleChange = (selected: MultiSelectOption[]) => {
    onCategoryChange(selected.map((s) => s.id));
  };

  return (
    <fieldset className={styles.categoryFilter}>
      <legend className={styles.header}>
        <Tag size={16} aria-hidden="true" />
        <span className={styles.title}>{t("common:categories")}</span>
      </legend>
      <MultiSelectFilter
        options={options}
        value={value}
        onChange={handleChange}
        label={t("common:categories")}
        placeholder={t("placeCategoryFilter.placeholder")}
      />
    </fieldset>
  );
};

export default PlaceCategoryFilter;
