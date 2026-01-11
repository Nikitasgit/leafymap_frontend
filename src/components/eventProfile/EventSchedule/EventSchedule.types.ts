import { Period } from "@/types/place/schedule";
import { PartnershipPopulated } from "@/types/partnerships";

export interface EventScheduleProps {
  schedule: Period[];
  partnerships: PartnershipPopulated[];
}
