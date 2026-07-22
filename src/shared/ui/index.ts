// Public API of the shared UI kit — import from "@/shared/ui".
// Prefer deep imports for tree-shaking and to avoid pulling the full kit:
// `@/shared/ui/buttons/button`.

export { default as Button } from "./buttons/button";
export { default as RoundButton } from "./buttons/roundButton";
export type { RoundButtonProps } from "./buttons/roundButton";
export { default as BackButton } from "./buttons/backButton";
export { default as SignOutButton } from "./buttons/signOutButton";

export { default as LoadingBar } from "./loading/loadingBar";
export { default as LoadingSpinner } from "./loading/loadingSpinner";

export { default as EmptyState } from "./noResults/emptyState";
export { default as PageHeader } from "./pageHeader";
export { SideBar } from "./sideBar";
export type { SideBarProps, SideBarTab } from "./sideBar";
export { default as ThreeDotsMenu } from "./threeDotsMenu";
export type {
  ThreeDotsMenuAction,
  ThreeDotsMenuProps,
} from "./threeDotsMenu";
export { default as Tooltip } from "./tooltip";

export { default as ActionButtons } from "./actions/actionButtons";
export type {
  ActionType,
  Action,
  ActionButtonsProps,
} from "./actions/actionButtons";

export { default as NotificationBadge } from "./badges/notificationBadge";
export { default as SubscribersCounter } from "./counters/subscribersCounter";
export { default as DisplayPublishingDate } from "./date/displayPublishingDate";
export { default as DateRange } from "./dateRange";
export type { DateRangeProps } from "./dateRange";

export { default as PlaceCategoryIcon } from "./icons/placeCategoryIcon";
export { getPlaceCategoryConfig } from "./icons/placeCategoryIcon";

export { default as TextField } from "./inputs/textField";
export { default as CguCheckbox } from "./inputs/cguCheckbox";
export type { CGUCheckboxProps } from "./inputs/cguCheckbox";
export { default as DatesSelector } from "./inputs/datesSelector";
export { default as ImageUploader } from "./inputs/imageUploader";
export { default as MultiSelectFilter } from "./inputs/multiSelectFilter";
export type {
  MultiSelectFilterProps,
  MultiSelectOption,
} from "./inputs/multiSelectFilter";
export { default as ProfilePictureUploader } from "./inputs/profilePictureUploader";
export { default as RadioYesOrNo } from "./inputs/radioYesOrNo";
export { default as SearchableSelect } from "./inputs/searchableSelect";
export type {
  SearchableSelectProps,
  SelectOption,
} from "./inputs/searchableSelect";
export { default as SearchInput } from "./inputs/searchInput";
export type {
  SearchInputProps,
  SearchSuggestion,
} from "./inputs/searchInput";

export { default as BaseModal } from "./modals/baseModal";
export { default as GalleryImageModal } from "./modals/galleryImageModal";
export { default as ShareModal } from "./modals/shareModal";
export type { ShareModalProps } from "./modals/shareModal";

export { default as Tab } from "./tabs/tab";
export { default as TabsContainer } from "./tabs/tabsContainer";
export { useTabsContainerContext } from "./tabs/tabsContainer";

export { default as ConditionalFooter } from "./footer";
export { Footer } from "./footer";

export { default as Avatar } from "./avatar";
export type { AvatarProps, AvatarUserInfo } from "./avatar";
