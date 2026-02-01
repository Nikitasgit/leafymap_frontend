import { PlacePopulated } from "@/types/place";
import { Action } from "@/components/common/actions/ActionButtons/ActionButtons.types";
import { UserPopulated } from "@/types/user";

export interface CreatorCardProps {
  user: UserPopulated;
  place?: PlacePopulated | null;
  actions?: Action[];
}
