"use client";

import { useTranslation } from "react-i18next";
import ThreeDotsMenu from "@/components/common/ThreeDotsMenu";
import styles from "./ProductCard.module.scss";
import type { ProductCardProps } from "./ProductCard.types";

const ProductCard = ({
  product,
  className,
  actions = [],
}: ProductCardProps) => {
  const { t } = useTranslation("common");
  const productCategory = product.productCategory;
  const categoryName =
    productCategory && typeof productCategory === "object" && productCategory.name
      ? t(`productCategories.${productCategory.name}`, productCategory.name)
      : "";
  const hasActions = actions.length > 0;

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {hasActions && (
        <ThreeDotsMenu
          className={styles.cardActions}
          actions={actions}
          ariaLabel="Ouvrir le menu"
        />
      )}
      <div className={styles.info}>
        {categoryName && (
          <p className={styles.categoryName}>{categoryName}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
