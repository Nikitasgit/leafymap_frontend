import React from "react";
import Text from "../../typography/Text";
import styles from "./PlaceCategoryBadge.module.scss";
import { useTranslation } from "react-i18next";

const PlaceCategoryBadge = ({ categoryName }: { categoryName: string }) => {
  const { t } = useTranslation("common");
  return (
    <Text as="span" className={styles.category}>
      {t(`placeCategories.${categoryName}`)}
    </Text>
  );
};

export default PlaceCategoryBadge;
