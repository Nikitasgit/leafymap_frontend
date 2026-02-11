"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  type MouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useUserProducts } from "@/hooks/useUserProducts";
import { ProductCategory } from "@/types/product";
import styles from "./ProductCategoriesBadges.module.scss";

export interface ProductCategoriesBadgesProps {
  userId: string;
}

const ProductCategoriesBadges = ({ userId }: ProductCategoriesBadgesProps) => {
  const { t } = useTranslation("common");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isMouseDownRef = useRef(false);
  const { products, isLoading } = useUserProducts(userId);

  const categoryNames = useMemo(() => {
    const names: string[] = [];
    for (const p of products) {
      const pc = p.productCategory;
      if (pc && typeof pc === "object" && (pc as ProductCategory).name) {
        names.push((pc as ProductCategory).name);
      }
    }
    return [...new Set(names)];
  }, [products]);

  const checkScrollable = () => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth;
    const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
    setIsScrollable(canScroll);
    setShowGradient(canScrollRight);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categoryNames.length === 0) return;
    checkScrollable();
    el.addEventListener("scroll", checkScrollable);
    window.addEventListener("resize", checkScrollable);
    return () => {
      el.removeEventListener("scroll", checkScrollable);
      window.removeEventListener("resize", checkScrollable);
    };
  }, [categoryNames.length]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isMouseDownRef.current = true;
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current || !isMouseDownRef.current) return;
    const currentX = e.pageX - scrollRef.current.offsetLeft;
    const deltaX = Math.abs(currentX - startX);
    if (deltaX > 5) {
      if (!isDragging) setIsDragging(true);
      e.preventDefault();
      const walk = (currentX - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    setStartX(0);
    setScrollLeft(0);
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    setStartX(0);
    setScrollLeft(0);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scrollRef.current.scrollLeft += e.deltaX;
      e.preventDefault();
    }
  };

  if (isLoading || categoryNames.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <span className={styles.label}>Produits&nbsp;:</span>
      <div
        className={`${styles.wrapper} ${
          showGradient ? styles.hasScrollableContent : ""
        }`}
      >
      <div
        ref={scrollRef}
        className={styles.scroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onScroll={checkScrollable}
        onWheel={handleWheel}
        onDragStart={(e) => e.preventDefault()}
        style={{
          cursor: isScrollable
            ? isDragging
              ? "grabbing"
              : "grab"
            : "default",
        }}
      >
        {categoryNames.map((name) => (
          <span key={name} className={styles.badge}>
            {t(`productCategories.${name}`, name)}
          </span>
        ))}
      </div>
      </div>
    </div>
  );
};

export default ProductCategoriesBadges;
