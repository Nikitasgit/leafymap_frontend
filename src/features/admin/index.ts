// Public API of the admin feature — import from "@/features/admin".
// Prefer deep imports from app/ for RSC safety.

// Types
export type {
  AdminResource,
  AdminContentItem,
  AdminUserContent,
} from "./api/adminApi";

// API
export {
  searchAdminUsers,
  getAdminUser,
  getAdminUserContent,
  banAdminUser,
  unbanAdminUser,
  softDeleteAdminUser,
  restoreAdminUser,
  softDeleteAdminResource,
  restoreAdminResource,
} from "./api/adminApi";

// Hooks
export {
  useAdminUserSearch,
  useAdminUserDetail,
  useAdminUserActions,
  useAdminResourceActions,
} from "./hooks/useAdminUsers";

// Components
export { default as AdminUsersSearchContainer } from "./components/adminUsersSearchContainer";
export { default as AdminUserDetailContainer } from "./components/adminUserDetailContainer";
export { default as AdminUserRow } from "./components/adminUserRow";
export { default as AdminUserSummaryCard } from "./components/adminUserSummaryCard";
export { default as AdminUserTabs } from "./components/adminUserTabs";
export { default as AdminContentTable } from "./components/adminContentTable";
