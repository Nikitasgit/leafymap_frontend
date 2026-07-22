import React from "react";
import styles from "./CreatorCategoryBadge.module.scss";
import { useTranslation } from "react-i18next";

const CreatorCategoryBadge = ({ categoryName }: { categoryName: string }) => {
  const { t } = useTranslation("common");
  return (
    <span className={styles.category}>
      {t(`creatorCategories.${categoryName}`)}
    </span>
  );
};

export default CreatorCategoryBadge;
