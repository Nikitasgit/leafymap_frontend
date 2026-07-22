// Public API of the partnerships feature — import from "@/features/partnerships".
// Prefer deep imports for types from other features to avoid barrel cycles:
// `@/features/partnerships/types`.

// Types
export type { Partnership, PartnershipPopulated } from "./types";

// API
export {
  fetchUserPartnerships,
  createPartnership,
  deletePartnership,
  updatePartnerships,
} from "./api/partnershipsApi";
export type {
  FetchPartnershipsParams,
  PartnershipUpdate,
} from "./api/partnershipsApi";

// Hooks
export { usePartnershipsAccepted } from "./hooks/usePartnershipsAccepted";
export { usePartnershipsReceived } from "./hooks/usePartnershipsReceived";
export type { UsePartnershipsReceivedOptions } from "./hooks/usePartnershipsReceived";
export { usePartnershipsSent } from "./hooks/usePartnershipsSent";
export type { UsePartnershipsSentOptions } from "./hooks/usePartnershipsSent";
export { useSendPartnership } from "./hooks/useSendPartnership";
export { default as useDeletePartnership } from "./hooks/useDeletePartnership";
export { usePartnershipInvitationActions } from "./hooks/usePartnershipInvitationActions";

// Components
export { default as PartnershipCard } from "./components/partnershipCard";
export { default as PartnershipsForm } from "./components/partnershipsForm";
export { default as PartnershipsFormList } from "./components/partnershipsFormList";
export { default as PartnershipsAcceptedTab } from "./components/partnershipsAcceptedTab";
export { default as PartnershipsReceivedTab } from "./components/partnershipsReceivedTab";
export { default as PartnershipsReceivedList } from "./components/partnershipsReceivedList";
export { default as PartnershipsSentTab } from "./components/partnershipsSentTab";
export { default as PartnershipsSentList } from "./components/partnershipsSentList";
