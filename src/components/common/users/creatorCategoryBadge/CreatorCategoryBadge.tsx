import React from "react";
import Text from "../../typography/Text";
import styles from "./CreatorCategoryBadge.module.scss";
import { useTranslation } from "react-i18next";

const CreatorCategoryBadge = ({ categoryName }: { categoryName: string }) => {
  const { t } = useTranslation("common");
  return (
    <Text as="span" className={styles.category}>
      {t(`creatorCategories.${categoryName}`)}
    </Text>
  );
};

export default CreatorCategoryBadge;
