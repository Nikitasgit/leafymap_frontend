import { EventPopulated } from "../../types/event";
import { PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";

export interface EventCardProps {
  event: EventPopulated;
  place?: PlacePopulated;
  user?: UserPopulated;
  clickable?: boolean;
}
