import { Period } from "@/features/places/types/schedule";

export interface EventScheduleUser {
  id: string;
  username?: string;
  image?: { urls?: { thumbnail?: string } };
  userCategory?: { name: string };
}

export interface EventScheduleProps {
  schedule: Period[];
  users: EventScheduleUser[];
}
