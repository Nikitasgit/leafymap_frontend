"use client";

import { useEventsSuggestions } from "@/hooks/useEventsSuggestions";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./EventSuggestionsList.module.scss";
import EventSuggestionCard from "../EventSuggestionCard";
import EventSuggestionCardSkeleton from "../EventSuggestionCard/EventSuggestionCardSkeleton";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const SKELETON_COUNT = 5;
const SCROLL_OFFSET = 220;

const EventSuggestionsList = () => {
  const { t } = useTranslation("marketing");
  const { events, isLoading, hasFetched } = useEventsSuggestions();
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
  }, [events.length, hasFetched, isLoading]);

  const showSkeletons = !hasFetched || isLoading;

  return (
    <section className={styles.eventSuggestionsList}>
      <h2>{t("home.eventsSectionTitle")}</h2>
      {hasFetched && events.length === 0 ? (
        <EmptyState
          title={t("home.eventsEmptyTitle")}
          icon={<Calendar className={styles.icon} />}
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
            className={styles.eventSuggestionsGrid}
            onScroll={checkScrollable}
          >
            {showSkeletons
              ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <EventSuggestionCardSkeleton key={`skeleton-${i}`} />
                ))
              : events.map((event) => (
                  <EventSuggestionCard key={event._id} event={event} />
                ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default EventSuggestionsList;
