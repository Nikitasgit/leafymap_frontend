import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface EventCardProps {
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
  clickable?: boolean;
}
