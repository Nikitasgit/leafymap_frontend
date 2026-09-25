import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Drama,
  Frame,
  Hammer,
  Monitor,
  Music,
  PartyPopper,
  Presentation,
  ShoppingBasket,
  Users,
  Wine,
} from "lucide-react";

export interface EventCategoryConfig {
  icon: LucideIcon;
  color: string;
}

export const EVENT_CATEGORY_CONFIG: Record<string, EventCategoryConfig> = {
  workshop: { icon: Hammer, color: "#E67E22" },
  exhibition: { icon: Frame, color: "#8E44AD" },
  market: { icon: ShoppingBasket, color: "#16A085" },
  tasting: { icon: Wine, color: "#C0392B" },
  concert: { icon: Music, color: "#9B59B6" },
  festival: { icon: PartyPopper, color: "#F39C12" },
  conference: { icon: Presentation, color: "#2980B9" },
  performance: { icon: Drama, color: "#E74C3C" },
  meetup: { icon: Users, color: "#27AE60" },
  online_event: { icon: Monitor, color: "#34495E" },
};

export const DEFAULT_EVENT_CATEGORY_CONFIG: EventCategoryConfig = {
  icon: Calendar,
  color: "#006624",
};

export function getEventCategoryConfig(
  categoryName: string | undefined,
): EventCategoryConfig {
  const normalizedKey = categoryName?.toLowerCase().replace(/\s+/g, "_") ?? "";
  return EVENT_CATEGORY_CONFIG[normalizedKey] ?? DEFAULT_EVENT_CATEGORY_CONFIG;
}
