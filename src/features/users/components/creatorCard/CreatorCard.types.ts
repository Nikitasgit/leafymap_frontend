import { PlacePopulated } from "@/features/places/types/place";
import type { Action } from "@/shared/ui/actions/actionButtons";
import { UserPopulated } from "../../types";

export interface CreatorCardProps {
  user: UserPopulated;
  place?: PlacePopulated | null;
  actions?: Action[];
}
