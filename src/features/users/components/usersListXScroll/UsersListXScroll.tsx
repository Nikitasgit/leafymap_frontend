"use client";

import styles from "./UsersListXScroll.module.scss";
import { useRef, useState, MouseEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PartnershipCard from "@/features/partnerships/components/partnershipCard";
import LoadingSpinner from "@/shared/ui/loading/loadingSpinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface UsersListXScrollUser {
  id: string;
  username?: string;
  image?: { urls?: { thumbnail?: string } };
  userCategory?: { name: string };
}

export interface UsersListXScrollProps {
  users: UsersListXScrollUser[];
  title?: string | React.ReactNode;
  showTitle?: boolean;
  showCategory?: boolean;
  loading?: boolean;
  showChevrons?: boolean;
}

const SCROLL_OFFSET = 200;

const UsersListXScroll = ({
  loading = false,
  users,
  title,
  showTitle = true,
  showCategory = false,
  showChevrons = false,
}: UsersListXScrollProps) => {
  const { t } = useTranslation("common");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const isMouseDownRef = useRef(false);

  const checkScrollable = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const { scrollLeft: left, scrollWidth, clientWidth } = el;
    const canScroll = scrollWidth > clientWidth;
    const canScrollRight = left < scrollWidth - clientWidth - 1;
    setIsScrollable(canScroll);
    setShowGradient(canScrollRight);
    setCanScrollLeft(left > 1);
  };

  const scrollBy = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const delta = direction === "left" ? -SCROLL_OFFSET : SCROLL_OFFSET;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    checkScrollable();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollable);
      const resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", checkScrollable);
        resizeObserver.disconnect();
      };
    }
  }, [users]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (showChevrons) return;
    const target = e.target as HTMLElement;
    if (
      target.tagName === "IMG" ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest(".imageContainer") ||
      target.closest("[role='button']")
    ) {
      return;
    }

    if (!scrollContainerRef.current) return;
    isMouseDownRef.current = true;
    setIsDragging(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (showChevrons || !scrollContainerRef.current || !isMouseDownRef.current)
      return;

    const currentX = e.pageX - scrollContainerRef.current.offsetLeft;
    const deltaX = Math.abs(currentX - startX);

    if (deltaX > 5) {
      if (!isDragging) {
        setIsDragging(true);
      }
      e.preventDefault();
      const walk = (currentX - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
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
    if (!scrollContainerRef.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scrollContainerRef.current.scrollLeft += e.deltaX;
      e.preventDefault();
    }
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      {showTitle && title && <h3 className={styles.sectionTitle}>{title}</h3>}
      <div
        className={`${styles.containerWrapper} ${
          showGradient ? styles.hasScrollableContent : ""
        } ${showChevrons ? styles.withChevrons : ""}`}
      >
        {showChevrons && isScrollable && canScrollLeft && (
          <button
            type="button"
            className={styles.chevronButton}
            onClick={() => scrollBy("left")}
            aria-label={t("usersListXScroll.scrollLeftAriaLabel")}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {showChevrons && isScrollable && showGradient && (
          <button
            type="button"
            className={`${styles.chevronButton} ${styles.chevronRight}`}
            onClick={() => scrollBy("right")}
            aria-label={t("usersListXScroll.scrollRightAriaLabel")}
          >
            <ChevronRight size={20} />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className={styles.cardsContainer}
          onMouseDown={showChevrons ? undefined : handleMouseDown}
          onMouseMove={showChevrons ? undefined : handleMouseMove}
          onMouseUp={showChevrons ? undefined : handleMouseUp}
          onMouseLeave={showChevrons ? undefined : handleMouseLeave}
          onScroll={checkScrollable}
          onWheel={showChevrons ? undefined : handleWheel}
          onDragStart={(e) => e.preventDefault()}
          style={{
            cursor: showChevrons
              ? "default"
              : isScrollable
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
          }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            users.map((user) => (
              <div key={user.id} className={styles.cardWrapper}>
                <PartnershipCard user={user} showCategory={showCategory} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default UsersListXScroll;
