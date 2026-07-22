// Public API of the follows feature — import from "@/features/follows".
// Prefer deep imports for types from other features to avoid barrel cycles:
// `@/features/follows/types`.

// Types
export type { FollowUser } from "./types";

// API
export {
  createFollow,
  deleteFollow,
  checkFollowStatus,
  fetchFollowers,
  fetchFollowing,
} from "./api/followsApi";
export type { FollowCheckResult, FollowRecord } from "./api/followsApi";

// Hooks
export { default as useFollow } from "./hooks/useFollow";
export { default as useFollowStatus } from "./hooks/useFollowStatus";
export { default as useFollowers } from "./hooks/useFollowers";
export { default as useFollowingUsers } from "./hooks/useFollowingUsers";

// Components
export { default as FollowersTab } from "./components/followersTab";
export { default as FollowingTab } from "./components/followingTab";
export { default as FollowingCount } from "./components/followingCount";
