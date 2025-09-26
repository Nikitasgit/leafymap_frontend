import { Event } from "@/types/place/event";
import { Partnership } from "@/types/partnerships";
import { Period } from "@/types/place/schedule";

export interface initialEventData {
  name: string;
  description: string;
  schedule: Period[];
}

export interface EventFormProps {
  eventData?: Event | null;
  isUpdate?: boolean;
  partnershipsData?: Partnership[];
}
