// Public API of the users feature — import from "@/features/users".
// Prefer deep imports for types from other features to avoid barrel cycles:
// `@/features/users/types`.

// Types
export type {
  User,
  UserPopulated,
  UserType,
  UserRole,
  UserPreferences,
} from "./types";

// Utils (owned by shared — re-exported for convenience)
export type { UserDisplayInfo } from "@/shared/utils/userDisplay";
export { getDisplayName, getAvatarLetter } from "@/shared/utils/userDisplay";

// API
export {
  getUserById,
  fetchUserById,
  searchUsers,
  updateUser,
  fetchUserProfile,
} from "./api/usersApi";
export type { UserProfile } from "./api/usersApi";

// Validations
export {
  createUsernameSchema,
  createValidateNewUserData,
  createValidateLegalNameFields,
  usernameSchema,
  validateNewUserData,
  validateLegalNameFields,
} from "./validations/userValidations";

// Hooks
export { default as useUser } from "./hooks/useUser";
export { default as useFindUsers } from "./hooks/useFindUsers";
export { default as useSubmitUser } from "./hooks/useSubmitUser";

// Components
export { default as UserProfileContainer } from "./components/userProfileContainer";
export { default as GallerySection } from "./components/gallerySection";
export { default as UserCard } from "./components/userCard";
export { default as CreatorCard } from "./components/creatorCard";
export { default as CreatorCategoryBadge } from "./components/creatorCategoryBadge";
export { default as UsersListXScroll } from "./components/usersListXScroll";
export type { UsersListXScrollUser } from "./components/usersListXScroll";
export { default as CreatorCardWithAddress } from "./components/creatorCardWithAddress";
