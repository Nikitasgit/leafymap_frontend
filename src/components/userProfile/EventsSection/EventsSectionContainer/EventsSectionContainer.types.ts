import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";

export interface EventsSectionContainerProps {
  eventPartnerships: PartnershipPopulated[];
  user: User;
}
