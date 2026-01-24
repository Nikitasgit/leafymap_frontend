import styles from "./UsersListXScroll.module.scss";
import { useRef, useState, MouseEvent, useEffect } from "react";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard/PartnershipCard";
import LoadingSpinner from "../../loading/LoadingSpinner";

export interface UserItem {
  _id: string;
  name?: string;
  username?: string;
  image?:
    | string
    | {
        urls?: {
          thumbnail?: string;
        };
      };
  category?: string;
}

export interface UsersListXScrollProps {
  users: UserItem[];
  title?: string | React.ReactNode;
  showTitle?: boolean;
  showCategory?: boolean;
  loading?: boolean;
}

const UsersListXScroll = ({
  loading = false,
  users,
  title,
  showTitle = true,
  showCategory = false,
}: UsersListXScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showGradient, setShowGradient] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const isMouseDownRef = useRef(false);

  const checkScrollable = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const canScroll = scrollWidth > clientWidth;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
    setIsScrollable(canScroll);
    setShowGradient(canScrollRight);
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
    // Ne pas activer le drag si on clique sur une image, un bouton ou un lien
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
    const rect = scrollContainerRef.current.getBoundingClientRect();
    setStartX(e.pageX - rect.left);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !isMouseDownRef.current) return;

    const rect = scrollContainerRef.current.getBoundingClientRect();
    const currentX = e.pageX - rect.left;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 5) {
      if (!isDragging) {
        setIsDragging(true);
      }
      e.preventDefault();
      e.stopPropagation();
      const walk = deltaX * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);
      setStartX(0);
      setScrollLeft(0);
    }
  };

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);
      setStartX(0);
      setScrollLeft(0);
    }
  };

  // Ne pas retourner null si on utilise les données de test
  if (users.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      {showTitle && title && <h3 className={styles.sectionTitle}>{title}</h3>}
      <div
        className={`${styles.containerWrapper} ${
          showGradient ? styles.hasScrollableContent : ""
        }`}
      >
        <div
          ref={scrollContainerRef}
          className={styles.cardsContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onScroll={checkScrollable}
          onDragStart={(e) => e.preventDefault()}
          style={{
            cursor: isScrollable
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
          }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            users.map((user) => {
              // Convertir UserItem au format attendu par PartnershipCard
              const imageUrl =
                typeof user.image === "string"
                  ? user.image
                  : user.image?.urls?.thumbnail || "";

              const cardUser = {
                _id: user._id,
                name: user.name || user.username || "Utilisateur",
                image: imageUrl,
                category: user.category || "",
              };

              return (
                <div key={user._id} className={styles.cardWrapper}>
                  <PartnershipCard
                    user={cardUser}
                    showCategory={showCategory}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default UsersListXScroll;
