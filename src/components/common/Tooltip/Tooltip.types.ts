import { CSSProperties, ReactNode } from "react";

export type TooltipPlace =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface TooltipProps {
  tooltip: string;
  className?: string;
  place?: TooltipPlace;
  style?: CSSProperties;
  children?: ReactNode;
  delay?: number; // Delay in milliseconds before showing tooltip
  maxWidth?: number; // Maximum width in pixels (default: no limit)
}
