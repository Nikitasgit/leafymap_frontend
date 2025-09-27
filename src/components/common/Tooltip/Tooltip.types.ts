import { CSSProperties } from "react";

export interface TooltipProps {
    tooltip: string;
    className?: string;
    place?: "top" | "bottom" | "left" | "right";
    style?: CSSProperties;
  }