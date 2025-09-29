import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";

export interface PlacesSectionProps {
  placePartnerships: PartnershipPopulated[];
  user: User;
}
