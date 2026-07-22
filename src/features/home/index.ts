// Public API of the home feature — import from "@/features/home".
// Prefer deep imports from app/ for RSC safety.

// Utils
export {
  getHeaderRoute,
  getHeaderCtaKey,
} from "./utils/home";
export type { HeaderCtaKey } from "./utils/home";

// Components
export { default as HomeHeader } from "./components/homeHeader";
export { default as SuggestionsList } from "./components/suggestionsList";
export { default as UserSuggestionCard } from "./components/userSuggestionCard";
