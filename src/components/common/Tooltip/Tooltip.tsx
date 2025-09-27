import { Info } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Tooltip.module.scss";
import { TooltipProps } from "./Tooltip.types";

const Tooltip: React.FC<TooltipProps> = ({
  tooltip,
  className = "",
  place = "right",
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

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
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`${styles.infoIconContainer} ${styles[place]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={style}
    >
      <Info size={16} />
      {isVisible && <div className={styles.tooltip}>{tooltip}</div>}
    </div>
  );
};

export default Tooltip;
