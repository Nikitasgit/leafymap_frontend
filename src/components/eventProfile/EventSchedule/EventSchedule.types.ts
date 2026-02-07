import { Period } from "@/types/place/schedule";

export interface EventScheduleUser {
  _id: string;
  username?: string;
  image?: { urls?: { thumbnail?: string } };
  userCategory?: { name: string };
}

export interface EventScheduleProps {
  schedule: Period[];
  users: EventScheduleUser[];
}
