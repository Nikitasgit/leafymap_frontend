import { DaySchedule, WeekDay } from "../../types/schedule";

export interface DefaultScheduleDayProps {
  day: WeekDay;
  schedule: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}
