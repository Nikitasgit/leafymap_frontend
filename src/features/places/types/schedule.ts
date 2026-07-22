import { Collaborator } from "./collaborators";
import { Image } from "@/shared/types/image";

export type DefaultSchedule = Record<WeekDay, DaySchedule>;

export interface ScheduleEventPreview {
  id: string;
  name: string;
  image?: Image | null;
}

export interface DaySchedule {
  open: boolean;
  timeSlots: TimeSlot[];
  events?: ScheduleEventPreview[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface EventTimeSlot extends TimeSlot {
  title: string;
  collaborators: Collaborator[];
  id: string;
}

export interface Period {
  startDate: string;
  endDate: string;
  timeSlots: EventTimeSlot[];
  id: string;
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
