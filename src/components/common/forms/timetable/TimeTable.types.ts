export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  open: boolean;
  timeSlots: TimeSlot[];
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
