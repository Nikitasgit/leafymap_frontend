import Image from "next/image";
import styles from "./PlaceInitiatorPartnerships.module.scss";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { Partnership } from "@/types/partnerships";
import { useRef, useState, MouseEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import creatorDefaultsSvg from "@public/images/creator_default.svg";
import { capitalizeFirstLetter } from "@/utils/functions";

export interface PlaceInitiatorPartnershipsProps {
  placeId: string;
  username: string;
}

const PlaceInitiatorPartnerships = ({
  placeId,
  username,
}: PlaceInitiatorPartnershipsProps) => {
  const { partnerships } = usePlacePartnerships(placeId, undefined, "place", {
    onlyAccepted: "true",
  });

  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
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
      window.addEventListener("resize", checkScrollable);
      return () => {
        container.removeEventListener("scroll", checkScrollable);
        window.removeEventListener("resize", checkScrollable);
      };
    }
  }, [partnerships]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isMouseDownRef.current = true;
    setHasMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !isMouseDownRef.current) return;

    const currentX = e.pageX - scrollContainerRef.current.offsetLeft;
    const deltaX = Math.abs(currentX - startX);

    if (deltaX > 5) {
      if (!isDragging) {
        setIsDragging(true);
      }
      setHasMoved(true);
      e.preventDefault();
      const walk = (currentX - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    setHasMoved(false);
    setStartX(0);
    setScrollLeft(0);
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
    setHasMoved(false);
    setStartX(0);
    setScrollLeft(0);
  };

  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    userId: string
  ) => {
    if (!hasMoved && !isDragging) {
      router.push(`/users/${userId}`);
    }
  };

  if (partnerships.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <b>{capitalizeFirstLetter(username)}</b> collabore avec :
      </h3>
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
          style={{
            cursor: isScrollable
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
          }}
        >
          {partnerships.map((partnership: Partnership) => {
            const collaborator =
              typeof partnership.collaborator === "object"
                ? partnership.collaborator
                : null;

            if (!collaborator) return null;

            const collaboratorName =
              ("username" in collaborator &&
                typeof collaborator.username === "string" &&
                collaborator.username) ||
              collaborator.name ||
              "";

            return (
              <div
                key={partnership._id}
                className={styles.card}
                onClick={(e) => handleCardClick(e, collaborator._id)}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={
                      typeof collaborator.image === "object"
                        ? collaborator.image?.urls?.thumbnail ||
                          creatorDefaultsSvg
                        : creatorDefaultsSvg
                    }
                    alt={collaboratorName || "Collaborateur"}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
                <p className={styles.username}>
                  {capitalizeFirstLetter(collaboratorName)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlaceInitiatorPartnerships;
