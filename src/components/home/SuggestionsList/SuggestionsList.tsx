"use client";

import { useFindUsers } from "@/hooks/useFindUsers";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SuggestionsList.module.scss";
import UserSuggestionCard from "../UserSuggestionCard";
import UserSuggestionCardSkeleton from "../UserSuggestionCard/UserSuggestionCardSkeleton";
import EmptyState from "@/components/common/noResults/EmptyState";
import { User, ChevronLeft, ChevronRight } from "lucide-react";

const CREATORS_LIMIT = 40;
const SKELETON_COUNT = 6;
const SCROLL_OFFSET = 220;

const SuggestionsList = () => {
  const { t } = useTranslation("marketing");
  const { users, isLoading, searchUsers } = useFindUsers();
  const [hasFetched, setHasFetched] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    searchUsers({ userType: "creator" }, CREATORS_LIMIT).finally(() =>
      setHasFetched(true)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkScrollable = () => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth > clientWidth;
    setIsScrollable(scrollable);
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
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
      const ro = new ResizeObserver(checkScrollable);
      ro.observe(container);
      return () => {
        container.removeEventListener("scroll", checkScrollable);
        ro.disconnect();
      };
    }
  }, [users.length, hasFetched, isLoading]);

  const showSkeletons = !hasFetched || isLoading;

  return (
    <section className={styles.suggestionsList}>
      <h2>{t("home.hostsSectionTitle")}</h2>
      {hasFetched && users.length === 0 ? (
        <EmptyState
          title={t("home.hostsEmptyTitle")}
          icon={<User className={styles.icon} />}
        />
      ) : (
        <div
          className={`${styles.gridWrapper} ${
            canScrollLeft ? styles.hasGradientLeft : ""
          } ${canScrollRight ? styles.hasGradientRight : ""}`}
        >
          {isScrollable && canScrollLeft && (
            <button
              type="button"
              className={styles.chevronButton}
              onClick={() => scrollBy("left")}
              aria-label={t("home.scrollLeft")}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {isScrollable && canScrollRight && (
            <button
              type="button"
              className={`${styles.chevronButton} ${styles.chevronRight}`}
              onClick={() => scrollBy("right")}
              aria-label={t("home.scrollRight")}
            >
              <ChevronRight size={20} />
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className={styles.suggestionsListGrid}
            onScroll={checkScrollable}
          >
            {showSkeletons
              ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <UserSuggestionCardSkeleton key={`skeleton-${i}`} />
                ))
              : users.map((user) => (
                  <UserSuggestionCard key={user.id} user={user} />
                ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SuggestionsList;
