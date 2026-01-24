import { Period } from "@/types/place/schedule";

export interface EventScheduleUser {
  _id: string;
  name?: string;
  image?: string;
  category?: string;
}

export interface EventScheduleProps {
  schedule: Period[];
  users: EventScheduleUser[];
}
