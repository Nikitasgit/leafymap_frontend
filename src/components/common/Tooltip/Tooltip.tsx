import { Info } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Tooltip.module.scss";
import { TooltipProps } from "./Tooltip.types";

const Tooltip: React.FC<TooltipProps> = ({
  tooltip,
  className = "",
  place = "right",
  style,
  children,
  delay = 0,
  maxWidth,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsVisible(true);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  const placeClassName = place.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  );

  const containerClassName = `${styles.tooltipWrapper} ${
    styles[placeClassName] || ""
  } ${className}`;

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={style}
    >
      {children || <Info size={16} />}
      {isVisible && (
        <div
          className={styles.tooltip}
          style={{
            width: maxWidth ? `${maxWidth}px` : undefined,
            whiteSpace: maxWidth ? "normal" : "nowrap",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
