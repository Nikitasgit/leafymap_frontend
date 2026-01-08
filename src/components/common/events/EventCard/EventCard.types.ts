import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";

export interface EventCardProps {
  event: EventPopulated;
  place?: PlacePopulated;
}
