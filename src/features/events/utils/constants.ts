export const ACTIVE_LIFECYCLE_STATUSES: ("upcoming" | "ongoing")[] = [
  "upcoming",
  "ongoing",
];

export function areEventBookingsOpen(
  lifecycleStatus: string | undefined
): boolean {
  return ACTIVE_LIFECYCLE_STATUSES.includes(
    lifecycleStatus as (typeof ACTIVE_LIFECYCLE_STATUSES)[number]
  );
}
