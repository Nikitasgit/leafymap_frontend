import { DefaultSchedule } from "@/types/place/schedule";

export interface DefaultScheduleFormProps {
  schedule: DefaultSchedule;
  onChange: (updatedSchedule: DefaultSchedule) => void;
}
