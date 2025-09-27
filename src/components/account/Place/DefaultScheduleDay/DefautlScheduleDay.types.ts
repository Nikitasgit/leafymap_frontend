import { DaySchedule, WeekDay } from "@/types/place/schedule";

export interface DefaultScheduleDayProps {
  day: WeekDay;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}
