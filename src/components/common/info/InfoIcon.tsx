import { Info } from "lucide-react";
import React, { CSSProperties, useState } from "react";
import styles from "./InfoIcon.module.scss";

interface InfoIconProps {
  tooltip: string;
  className?: string;
  place?: "top" | "bottom" | "left" | "right";
  style?: CSSProperties;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  tooltip,
  className = "",
  place = "right",
  style,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <div
      className={`${styles.infoIconContainer} ${styles[place]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <Info size={16} />
      {isVisible && <div className={styles.tooltip}>{tooltip}</div>}
    </div>
  );
};

export default InfoIcon;
