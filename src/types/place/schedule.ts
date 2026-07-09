import { Collaborator } from "./collaborators";

export type DefaultSchedule = Record<WeekDay, DaySchedule>;

import { Image } from "../image";

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
  _id: string;
}

export interface Period {
  startDate: string;
  endDate: string;
  timeSlots: EventTimeSlot[];
  _id: string;
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
