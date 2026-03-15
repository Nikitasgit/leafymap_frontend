import { Tag } from "lucide-react";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon/PlaceCategoryIcon";
import styles from "./PlaceCategoryFilter.module.scss";
import { useTranslation } from "react-i18next";
import { PlaceCategoryFilterProps } from "./PlaceCategoryFilter.types";

const PlaceCategoryFilter: React.FC<PlaceCategoryFilterProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const placeCategories = useAppSelector(selectPlaceCategories);
  const { t } = useTranslation("common");
  const onCategoryClick = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newCategories);
  };

  return (
    <fieldset className={styles.categoryFilter}>
      <legend className={styles.header}>
        <Tag size={16} aria-hidden="true" />
        <span className={styles.title}>{t("categories")}</span>
      </legend>
      <ul className={styles.categoriesList} role="group">
        {placeCategories.map((category) => {
          const isSelected = selectedCategories.includes(category._id);
          return (
            <li key={category._id}>
              <button
                type="button"
                className={`${styles.categoryItem} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => onCategoryClick(category._id)}
                aria-pressed={isSelected}
                aria-label={`${t(
                  `placeCategories.${category.name.toLowerCase()}`,
                )}${isSelected ? " - sélectionné" : ""}`}
              >
                <PlaceCategoryIcon
                  categoryName={category.name}
                  variant={isSelected ? "primary" : "grey"}
                />
                <span
                  className={
                    isSelected ? styles.selectedText : styles.unselectedText
                  }
                >
                  {t(`placeCategories.${category.name.toLowerCase()}`)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};

export default PlaceCategoryFilter;
