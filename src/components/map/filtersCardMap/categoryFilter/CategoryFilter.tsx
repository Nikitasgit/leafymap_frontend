import React from "react";
import Text from "@/components/common/typography/Text";
import { Tag } from "lucide-react";
import { useAppSelector } from "@/store";
import { selectPlaceCategories } from "@/store/appSlice";
import PlaceCategoryIcon from "@/components/common/icons/PlaceCategoryIcon";
import styles from "./CategoryFilter.module.scss";
import { useTranslation } from "react-i18next";

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
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
    <div className={styles.categoryFilter}>
      <div className={styles.header}>
        <Tag size={16} />
        <Text className={styles.title}>{t("categories")}</Text>
      </div>

      <ul className={styles.categoriesList}>
        {placeCategories.map((category) => {
          const isSelected = selectedCategories.includes(category._id);
          return (
            <li
              key={category._id}
              className={`${styles.categoryItem} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => onCategoryClick(category._id)}
            >
              <PlaceCategoryIcon
                categoryName={category.name}
                variant={isSelected ? "primary" : "grey"}
              />
              <Text
                className={
                  isSelected ? styles.selectedText : styles.unselectedText
                }
              >
                {t(`placeCategories.${category.name.toLowerCase()}`)}
              </Text>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryFilter;
