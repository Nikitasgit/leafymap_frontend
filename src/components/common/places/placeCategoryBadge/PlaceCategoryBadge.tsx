import React from "react";
import styles from "./PlaceCategoryBadge.module.scss";
import { useTranslation } from "react-i18next";

const PlaceCategoryBadge = ({ categoryName }: { categoryName: string }) => {
  const { t } = useTranslation("common");
  return (
    <span className={styles.category}>
      {t(`placeCategories.${categoryName}`)}
    </span>
  );
};

export default PlaceCategoryBadge;
