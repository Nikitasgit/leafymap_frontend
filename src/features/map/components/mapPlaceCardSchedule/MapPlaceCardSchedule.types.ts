import { DefaultSchedule } from "@/features/places/types/schedule";
import { PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";

export interface MapPlaceCardScheduleProps {
  schedule: DefaultSchedule;
  className?: string;
  place?: PlacePopulated | null;
  user?: UserPopulated | null;
  isPlaceLoading?: boolean;
}
