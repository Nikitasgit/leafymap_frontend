import { PlacePopulated } from "@/types/place";
import { Action } from "@/components/common/actions/ActionButtons/ActionButtons.types";
import { UserPopulated } from "@/types/user";

export interface PlaceCardProps {
  place: PlacePopulated;
  actions?: Action[];
  user?: UserPopulated;
}
