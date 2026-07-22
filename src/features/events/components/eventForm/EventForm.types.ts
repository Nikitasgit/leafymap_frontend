import { Event } from "../../types/event";
import type { Partnership } from "@/features/partnerships/types";
import { Period } from "@/features/places/types/schedule";
import { Location } from "@/shared/types/common";

export interface initialEventData {
  name: string;
  description: string;
  eventCategory: string;
  schedule: Period[];
  place?: string | null;
  location?: Location | null;
  online: boolean;
  isBookable: boolean;
  capacity: string;
  maxSeatsPerBooking: string;
}

export interface EventFormProps {
  eventData?: Event | null;
  isUpdate?: boolean;
  partnershipsData?: Partnership[];
}
