import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Landmark,
  Store,
  Palette,
  Sprout,
  ShoppingBag,
  Apple,
  PartyPopper,
  Library,
  Users,
  LayoutGrid,
  Paintbrush,
  Hammer,
  Layers,
  Wine,
  Hand,
  Wheat,
  Sparkles,
  House,
} from "lucide-react";

export interface PlaceCategoryConfig {
  icon: LucideIcon;
  color: string;
}

export const PLACE_CATEGORY_CONFIG: Record<string, PlaceCategoryConfig> = {
  cultural_center: { icon: Landmark, color: "#6B4EAA" },
  street_stand: { icon: Store, color: "#E67E22" },
  craft_fair: { icon: Palette, color: "#D35400" },
  farm: { icon: Sprout, color: "#27AE60" },
  food_market: { icon: Apple, color: "#F39C12" },
  festival: { icon: PartyPopper, color: "#9B59B6" },
  library: { icon: Library, color: "#3498DB" },
  cooperative_store: { icon: Users, color: "#1ABC9C" },
  boutique: { icon: Store, color: "#E74C3C" },
  market: { icon: ShoppingBag, color: "#16A085" },
  gallery: { icon: LayoutGrid, color: "#8E44AD" },
  artist_studio: { icon: Paintbrush, color: "#9B59B6" },
  workshop: { icon: House, color: "#607D8B" },
  tasting_room: { icon: Wine, color: "#C0392B" },
  artisan_market: { icon: Hand, color: "#D35400" },
  farmers_market: { icon: Wheat, color: "#27AE60" },
  showroom: { icon: LayoutGrid, color: "#7F8C8D" },
  cultural_fair: { icon: Sparkles, color: "#9B59B6" },
};

export const DEFAULT_CONFIG: PlaceCategoryConfig = {
  icon: MapPin,
  color: "#006624",
};

export function getPlaceCategoryConfig(
  categoryName: string | undefined,
): PlaceCategoryConfig {
  const normalizedKey = categoryName?.toLowerCase().replace(/\s+/g, "_") ?? "";
  return PLACE_CATEGORY_CONFIG[normalizedKey] ?? DEFAULT_CONFIG;
}
