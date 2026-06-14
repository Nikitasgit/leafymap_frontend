import { Event } from "@/types/place/event";
import { Partnership } from "@/types/partnerships";
import { Period } from "@/types/place/schedule";
import { Location } from "@/types/common";

export interface initialEventData {
  name: string;
  description: string;
  eventCategory: string;
  schedule: Period[];
  place?: string | null;
  location?: Location | null;
  online: boolean;
}

export interface EventFormProps {
  eventData?: Event | null;
  isUpdate?: boolean;
  partnershipsData?: Partnership[];
}
