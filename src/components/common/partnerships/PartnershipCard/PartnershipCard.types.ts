import { PartnershipPopulated } from "@/types/partnerships";

export interface PartnershipCardProps {
  creator: PartnershipPopulated["collaborator"];
  showCategory?: boolean;
  className?: string;
}
