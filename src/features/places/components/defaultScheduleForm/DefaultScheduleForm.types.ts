import { DefaultSchedule } from "../../types/schedule";

export interface DefaultScheduleFormProps {
  schedule: DefaultSchedule;
  onChange: (updatedSchedule: DefaultSchedule) => void;
}
