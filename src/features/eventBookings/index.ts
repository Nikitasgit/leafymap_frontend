// Public API of the eventBookings feature — import from "@/features/eventBookings" only.
// Server pages needing only a component should deep-import that component
// to avoid pulling client hooks into the server module graph.

// Types
export type {
  EventBooking,
  EventBookingEvent,
  EventBookingUser,
  EventBookingStatus,
  MyEventBooking,
  EventBookingWithUser,
} from "./types";

// Hooks
export { useCreateEventBooking } from "./hooks/useCreateEventBooking";
export { useUpdateEventBooking } from "./hooks/useUpdateEventBooking";
export { useCancelEventBooking } from "./hooks/useCancelEventBooking";
export { useMyBookingForEvent } from "./hooks/useMyBookingForEvent";
export { useMyEventBookings } from "./hooks/useMyEventBookings";
export { useEventBookingsForEvent } from "./hooks/useEventBookingsForEvent";
export { useBookingLimits } from "./hooks/useBookingLimits";

// Components
export { default as EventBookingWidget } from "./components/eventBookingWidget";
export { default as EventBookingsManageTab } from "./components/eventBookingsManageTab";
export { default as SeatsStepper } from "./components/seatsStepper";
export { default as MyEventBookingsTab } from "./components/myEventBookings/myEventBookingsTab";
