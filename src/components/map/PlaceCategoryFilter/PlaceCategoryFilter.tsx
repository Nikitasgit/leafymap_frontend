import { useMemo } from "react";
import { Tag } from "lucide-react";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";
import { useTranslation } from "react-i18next";
import MultiSelectFilter from "@/components/common/inputs/MultiSelectFilter";
import { MultiSelectOption } from "@/components/common/inputs/MultiSelectFilter";
import styles from "./PlaceCategoryFilter.module.scss";
import { PlaceCategoryFilterProps } from "./PlaceCategoryFilter.types";

const PlaceCategoryFilter: React.FC<PlaceCategoryFilterProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const placeCategories = useAppSelector(selectPlaceCategories);
  const { t } = useTranslation("common");

  const options: MultiSelectOption[] = useMemo(
    () =>
      placeCategories.map((cat) => ({
        _id: cat._id,
        label: t(`placeCategories.${cat.name.toLowerCase()}`, cat.name),
      })),
    [placeCategories, t]
  );

  const value = useMemo(
    () => options.filter((opt) => selectedCategories.includes(opt._id)),
    [options, selectedCategories]
  );

  const handleChange = (selected: MultiSelectOption[]) => {
    onCategoryChange(selected.map((s) => s._id));
  };

  return (
    <fieldset className={styles.categoryFilter}>
      <legend className={styles.header}>
        <Tag size={16} aria-hidden="true" />
        <span className={styles.title}>{t("categories")}</span>
      </legend>
      <MultiSelectFilter
        options={options}
        value={value}
        onChange={handleChange}
        label={t("categories")}
        placeholder={t("placeCategories.placeholder", "Sélectionner...")}
      />
    </fieldset>
  );
};

export default PlaceCategoryFilter;
