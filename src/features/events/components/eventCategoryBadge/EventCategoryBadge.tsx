import React from "react";
import styles from "./EventCategoryBadge.module.scss";
import { useTranslation } from "react-i18next";

const EventCategoryBadge = ({ categoryName }: { categoryName: string }) => {
  const { t } = useTranslation("common");
  return (
    <span className={styles.category}>
      {t(`eventCategories.${categoryName}`, { defaultValue: categoryName })}
    </span>
  );
};

export default EventCategoryBadge;
