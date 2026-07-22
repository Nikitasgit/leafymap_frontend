// Public API of the account feature — import from "@/features/account" only.

// Components
export { default as AccountContainer } from "./components/accountContainer";
export { default as AccountHeader } from "./components/accountHeader";
export { default as AccountActions } from "./components/accountActions";
export { default as AccountTabShell } from "./components/accountTabShell";
export { default as AccountSettingsContainer } from "./components/accountSettings/accountSettingsContainer";
export { default as CreateProfileStepper } from "./components/createProfileStepper";
export { UpdateCreator } from "./components/creator/updateCreator";
export { UserContactForm } from "./components/contactForm";
export type { UserContactFormProps } from "./components/contactForm";
export { UserInfo } from "./components/profileInfo";
export {
  CategorySelectorInput,
  PlaceCategorySelectorInput,
  EventCategorySelectorInput,
} from "./components/categorySelectorInput";
export { default as AccountGalleryTab } from "./components/sideBarImages/AccountGalleryTab";
export { default as EventModifyContainer } from "./components/eventModifyContainer";

// Types shared with Event/Place forms (legacy until those features migrate)
export type {
  FormDataChangeHandler,
  InitialPlaceData,
  InitialCreatorData,
} from "./components/createProfileStepper";

// Hooks
export { useAccountSidebar } from "./hooks/useAccountSidebar";
export type { UseAccountSidebarResult } from "./hooks/useAccountSidebar";
export { useDeleteAccount } from "./hooks/useDeleteAccount";

// Utils
export {
  SIDEBAR_PARAM,
  TAB_PARAM,
  SIDEBAR_VALUES,
  COLLABORATIONS_TAB_IDS,
  EVENTS_TAB_IDS,
  BOOKINGS_TAB_IDS,
  REVIEWS_TAB_IDS,
  FOLLOWS_TAB_IDS,
  PRODUCTS_TAB_IDS,
  IMAGES_TAB_IDS,
  getAccountPathWithSidebar,
  getAccountSidebarPath,
  getNotificationRedirectPath,
  handleNotificationRedirect,
} from "./utils/accountTabs";
export type { SidebarValue } from "./utils/accountTabs";
export { defaultSchedule } from "./utils/createProfile";
