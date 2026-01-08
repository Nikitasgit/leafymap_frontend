"use client";
import {
  useRef,
  useState,
  MouseEvent,
  useEffect,
  createContext,
  useContext,
} from "react";
import styles from "./TabsContainer.module.scss";

interface TabsContainerContextType {
  hasMoved: boolean;
  isDragging: boolean;
}

const TabsContainerContext = createContext<TabsContainerContextType>({
  hasMoved: false,
  isDragging: false,
});

export const useTabsContainerContext = () => useContext(TabsContainerContext);

interface TabsContainerProps {
  children: React.ReactNode;
}

export default function TabsContainer({ children }: TabsContainerProps) {
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
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      checkScrollable();
    }, 0);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollable);
      window.addEventListener("resize", checkScrollable);
      return () => {
        container.removeEventListener("scroll", checkScrollable);
        window.removeEventListener("resize", checkScrollable);
      };
    }
  }, [children]);

  // Also check on mount and after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollable();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    // Allow horizontal scrolling with wheel + shift or trackpad
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      scrollContainerRef.current.scrollLeft += e.deltaX;
      e.preventDefault();
    }
  };

  return (
    <TabsContainerContext.Provider value={{ hasMoved, isDragging }}>
      <div
        className={`${styles.containerWrapper} ${
          showGradient ? styles.hasScrollableContent : ""
        }`}
      >
        <div
          ref={scrollContainerRef}
          className={styles.tabs}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onScroll={checkScrollable}
          onWheel={handleWheel}
          style={{
            cursor: isScrollable
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
          }}
        >
          {children}
        </div>
      </div>
    </TabsContainerContext.Provider>
  );
}
