import { DefaultSchedule } from "@/types/place/schedule";
import { PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface MapPlaceCardScheduleProps {
  schedule: DefaultSchedule;
  className?: string;
  place?: PlacePopulated | null;
  user?: UserPopulated | null;
  isPlaceLoading?: boolean;
}
