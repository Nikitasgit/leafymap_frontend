# Frontend architecture refactoring tracker

Migration from a hybrid **layered-by-type** layout toward a **feature-based modular architecture** (Bulletproof React style).

Companion of the backend Clean Architecture: vertical slices by domain + unidirectional dependencies.

## Dependency rule

```
shared ← features ← app
         ↑
       store (configureStore only; slices live in features/*/model)
```

- `shared/` never imports `features/` or `app/`
- A feature may import `shared/` freely
- Cross-feature imports go **only** through the public barrel `@/features/<name>` (not deep paths)
- `app/` stays thin: routing, layouts, pages → feature containers

## Naming conventions

| Kind | Convention | Example |
|------|------------|---------|
| Feature / segment folders | camelCase / lowercase | `features/auth/hooks` |
| Component folders | camelCase | `signinForm/SigninForm.tsx` |
| Component files | PascalCase | `SigninForm.tsx` |
| Hooks / api / utils files | camelCase | `useAuth.ts`, `authApi.ts` |
| Component internal layout | fixed | `Component.tsx` + `.module.scss` + `.types.ts` + `index.ts` |

## Pass status

| Feature / area | Status | Notes |
|----------------|--------|-------|
| Skeleton (`shared/`, ESLint boundaries, docs) | **done** (Pass 1) | |
| `auth` | **done** (Pass 1) | Reference feature — model for next batches |
| `account` | **done** (Pass 2 — shell) | Shell only; Products (Pass 16); Partnership (Pass 9); Reviews (Pass 10); Follows (Pass 11); Place (Pass 5); `EventModifyContainer` (Pass 4) |
| `events` | **done** (Pass 3 + split Pass 4) | Entité cœur uniquement |
| `eventBookings` | **done** (Pass 4) | Split depuis `events` |
| `eventInvitations` | **done** (Pass 4) | Split depuis `events` |
| `places` | **done** (Pass 5) | Place entity UI/hooks/api/types/validations/utils ; schedule types owned here |
| `map` | **done** (Pass 6) | Mapbox UI + filters + cards + geocoding utils ; `appSlice` stays global (categories) |
| `messages` | **done** (Pass 7) | conversations UI + socket hooks + conversationsApi ; unread stays in notificationSlice |
| `notifications` | **done** (Pass 8) | notification UI + notificationSlice + useUserNotifications + notificationsApi |
| `partnerships` | **done** (Pass 9) | forms/lists/tabs + PartnershipCard + partnershipsApi + hooks ; EventPartnershipsSelect stays in events |
| `reviews` + `comments` | **done** (Pass 10) | reviews UI + stars + reviewsApi ; comments CommentInput + commentsApi ; creator shell in Pass 12 |
| `follows` | **done** (Pass 11) | Followers/Following tabs + FollowingCount + followsApi + hooks ; CreatorActionButtons stays in creator |
| `users` + `creator` | **done** (Pass 12) | user types/api/hooks/cards + profile container ; creator shell UI + useCreatorData |
| `admin` | **done** (Pass 13) | admin users search/detail + content moderation ; adminApi + useAdminUsers |
| `home` | **done** (Pass 14) | HomeHeader + creator SuggestionsList/UserSuggestionCard + home utils ; EventSuggestion* stays in events |
| `favorites` | **done** (Pass 15) | favoritesSlice + favoritesApi ; map favorites-mode UI + creator bookmark stay put |
| `products` | **done** (Pass 16) | MyProductsTab + productsApi + hooks/types ; ProductCategoriesBadges stays in creator |
| `shared/ui` (ex-`components/common`) | **done** (Pass 17) | Design system under `shared/ui` ; coupled widgets → map/places ; Avatar + userDisplay in shared |
| `layout/navbar` (ex-`components/navbar`) | **done** (Pass 17) | App chrome under `components/layout/navbar` (imports auth/notifications — not in shared) |
| `shared/hooks`, `shared/config`, `shared/styles` | **done** (Pass 18) | + shared/types, shared/utils, shared/lib |
| `categories` (ex-`appSlice`) | **done** (Pass 18) | categoriesSlice under features/categories/model |

### Pass 1 completed checklist

- [x] `features/auth/` auto-contained (api, components camelCase folders, hooks, model, types, validations, index)
- [x] `shared/api` (+ shims on `lib/api/client`)
- [x] ESLint boundaries + `no-restricted-imports` on `shared/` (warn)
- [x] README architecture section + this tracker
- [x] `npm run lint` (0 errors), `npm run build`, `npm run knip` green

## Audit de conformité — auth / account / events (2026-07-21)

Revue de l'implémentation par l'agent. Build vert, lint 0 erreur, migration via shims OK.

### Conforme
- Structure des 3 features : `api/ components/ hooks/ (model|types)/ validations/ + index.ts`.
- Casse dossiers **camelCase** + fichiers **PascalCase** cohérente (convention volontairement mise à jour).
- `events/api/eventsApi.ts` isolé "server-safe" (barrel documente l'import direct de l'API pour les RSC).

### À corriger / finir (par ordre de priorité)
1. **Imports profonds** : tolérés depuis `app/` (RSC) et pour casser les cycles `account ↔ events` (EventForm importe account). `accountSidebarConfig` importe désormais chaque onglet depuis la feature propriétaire (plus via l'agrégat `events/sideBarEvents`). Durcir ESLint `entry-point` en fin de migration.
2. **`account` shell** : SideBars domain (Partnership, Reviews, Follows, Products, Place, Events…) migrés vers leurs features ; seuls shell + orchestrateurs restent dans `account`.

### Décision — séparer events / eventBookings / eventInvitations — **faite (Pass 4)**

Motivation : parité avec le backend (`usecases/events|eventBookings|eventInvitations`), éviter une "god feature", frontières nettes.

- **`events`** (entité cœur) : eventCard, eventSmallCard, eventDetails, eventForm, schedule*, eventStatus, eventModal, eventCreateContainer, eventsTab, eventSuggestions*, accountEventCard/List, sideBarEvents/myEvents. Hooks cœur + types `event.ts` + validations.
- **`eventBookings`** : eventBookingWidget, eventBookingsManageTab, seatsStepper, myEventBookings. Hooks booking + types `eventBooking.ts`.
- **`eventInvitations`** : eventInvitationsReceived, eventParticipations, eventDetailsWithParticipants. Hooks invitation + types `eventInvitation.ts`.
- **`account/eventModifyContainer`** : orchestrateur multi-features (edit + bookings tab + invitations pour le form) — ne peut pas vivre dans `events` sans inverser les dépendances.

Règle : `eventBookings` / `eventInvitations` → `events` (jamais l'inverse, hors `EventForm` → hook submit invitations). `eventInvitations` peut → `eventBookings` (`useBookingLimits`).

## Temporary shims

**Removed (end-of-migration).** All re-export shims under `hooks/`, `utils/`, `lib/`, domain `types/`, `validations/`, `styles/`, `store/*Slice`, and legacy `components/*` (except layout chrome) have been deleted. Callers import `@/shared/*` or `@/features/<name>` directly.

### Pass 2 completed checklist

- [x] `features/account/` shell auto-contained (api, components, hooks, utils, index)
- [x] App pages `account/{page,create,settings,update-creator}` use `@/features/account`
- [x] Event + SideBars left in legacy then migrated in later passes (Products Pass 16; Place Pass 5; Partnership Pass 9; Reviews Pass 10; Follows Pass 11)
- [x] Shims for hooks/utils/shell components
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 3 completed checklist

- [x] `features/events/` auto-contained (api, components camelCase, hooks, types, validations, index)
- [x] App event pages + home suggestions use feature paths (deep imports for RSC safety); accountSidebarConfig → sideBarEvents
- [x] Auth + account component folders renamed to camelCase; docs updated
- [x] Shims for hooks/api/types/validations/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 4 completed checklist

- [x] `features/eventBookings/` + `features/eventInvitations/` extracted from `events`
- [x] `EventModifyContainer` moved to `features/account` (multi-feature orchestrator)
- [x] `EventDetailsWithParticipants` in eventInvitations; public event page composes details + booking widget
- [x] SideBar tabs imported from owning features; shims re-pointed
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 5 completed checklist

- [x] `features/places/` auto-contained (api, components camelCase, hooks, types, validations, utils, index)
- [x] App place create/update pages + account ProfileFormStep/CreateProfileStepper/Settings use feature paths (deep imports to break account ↔ places)
- [x] Schedule/collaborator/place types owned by places; events + eventInvitations import from `@/features/places/types`
- [x] Shims for hooks/api/types/validations/utils/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 6 completed checklist

- [x] `features/map/` auto-contained (components camelCase, hooks, types, utils/constants, index) — no `model/` (`appSlice` stays global categories)
- [x] App map page + PlaceForm/LocationPicker/AddressInput + creator PresentationTab/CreatorActionButtons use feature paths (deep imports to break places ↔ map / creator ↔ map)
- [x] `usePlacesInView` / `useEventsInView` import `MapFilters` from `@/features/map/types`
- [x] Shims for hooks/types/utils/legacy component paths + map constants re-export
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 7 completed checklist

- [x] `features/messages/` auto-contained (api, components camelCase, hooks, types, index) — no `model/` (unread stays in notificationSlice)
- [x] App inbox page + CreatorActionButtons use feature deep paths (RSC-safe; avoid full barrel from app/)
- [x] Types extracted (`Conversation`, `Message`, `MessagePartnership`); `useSocket` owned by messages
- [x] Barrel exports component as `MessageBubble` to avoid clash with type `Message`
- [x] Shims for hooks/api/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 8 completed checklist

- [x] `features/notifications/` auto-contained (api, model, components camelCase, hooks, types, utils, index)
- [x] Store + AppInitializer + Navbar use feature deep/model paths; messages + account import `@/features/notifications`
- [x] `notificationsApi` extracted; `unreadConversations` stays in notificationSlice
- [x] Shims for store/hooks/types/utils/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 9 completed checklist

- [x] `features/partnerships/` auto-contained (api, components camelCase, hooks, types, index)
- [x] accountSidebarConfig + EventForm + PresentationTab + eventBookings/eventInvitations cards use feature paths (deep imports to break events ↔ partnerships via EventStatus)
- [x] `partnershipsApi` extracted; types owned by feature; events types import from `@/features/partnerships/types`
- [x] Shims for hooks/types/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 10 completed checklist

- [x] `features/reviews/` auto-contained (api, components camelCase incl. stars, hooks, types, index)
- [x] `features/comments/` auto-contained (api, CommentInput, hooks, types, index)
- [x] accountSidebarConfig + CreatorTabs + CreatorHeader use feature deep paths; ReviewCard → comments deep paths
- [x] `reviewsApi` + `commentsApi` extracted; types owned by features
- [x] Shims for hooks/types/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 11 completed checklist

- [x] `features/follows/` auto-contained (api, components camelCase, hooks, types, index)
- [x] accountSidebarConfig + CreatorHeader + CreatorActionButtons use feature deep paths
- [x] `followsApi` extracted; types owned by feature
- [x] Shims for hooks/types/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 12 completed checklist

- [x] `features/users/` auto-contained (api, components camelCase, hooks, types, utils, validations, index)
- [x] `features/creator/` auto-contained (components camelCase, useCreatorData, index) — depends on users
- [x] App users page + map creator card + follows/messages/events/reviews/account use feature deep paths
- [x] `usersApi` extracted (incl. profile fetch); types owned by users; UpdateCreator stays in account
- [x] Shims for hooks/api/types/utils/validations/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 13 completed checklist

- [x] `features/admin/` auto-contained (api, components camelCase, hooks, index) — types co-located in adminApi
- [x] App admin users pages use feature deep paths; ProtectedRoute stays in auth
- [x] `adminApi` extracted; UserRole / auth redirect left outside admin
- [x] Shims for hooks/api/legacy component paths
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 14 completed checklist

- [x] `features/home/` auto-contained (components camelCase, utils, index) — no api/hooks/types
- [x] App home page uses feature deep paths; EventSuggestionsList stays in events
- [x] `utils/home` owned by feature; users deep paths for types/hooks/badge/display
- [x] Shims for home components + utils/home; EventSuggestion* shims left as-is
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 15 completed checklist

- [x] `features/favorites/` auto-contained (api, model, index) — no components/hooks/types
- [x] store/index + AppInitializer use deep model path; creator/map import from feature
- [x] Map favorites-mode UI and CreatorActionButtons bookmark stay outside favorites
- [x] Shims for `lib/api/favorites` + `store/favoritesSlice`
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 16 completed checklist

- [x] `features/products/` auto-contained (api, components camelCase, hooks, types, index)
- [x] accountSidebarConfig + ProductCategoriesBadges + useApp/appSlice use feature paths
- [x] `productsApi` extracted; types owned by feature; ProductCategoriesBadges stays in creator
- [x] Shims for hooks/types/legacy SideBarProducts path
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 17 completed checklist

- [x] `shared/ui/` populated (buttons, inputs, modals, loading, tabs, Footer, Avatar, SearchInput with badge slots, …)
- [x] Feature-coupled widgets relocated: LocationPicker/AddressInput → map ; TimeSlotInputs → places
- [x] `userDisplay` → `shared/utils` ; Avatar → `shared/ui` (no feature import from shared)
- [x] Navbar → `components/layout/navbar` (app chrome; keeps auth/notifications imports)
- [x] Legacy shims under `components/common` + `components/navbar` ; knip updated
- [x] `npm run lint`, `npm run build`, `npm run knip` green

### Pass 18 completed checklist

- [x] `shared/hooks/` populated (toast, loading, mediaQuery, onClickOutside, handleApiErrors, validatedForm, images)
- [x] `useGeolocation` → `features/map/hooks`
- [x] `shared/config/app`, `shared/utils`, `shared/types`, `shared/lib/validations`
- [x] `shared/styles/` (main, abstracts, base, sonner, muiTheme)
- [x] `features/categories/` (categoriesSlice + useCategories); store key `categories`
- [x] Page + entity metadata in `app/lib/` (imports app i18n / features — not shared)
- [x] Temporary shims then deleted in end-of-migration cleanup
- [x] `npm run lint`, `npm run build`, `npm run knip` green

## End-of-migration checklist

- [x] ESLint `boundaries/*` rules switched from `warn` to `error`
- [x] All temporary shims deleted
- [x] `src/components/` (except layout chrome), `src/hooks/`, `src/lib/`, domain `src/types/`, `src/validations/`, `src/utils/`, `src/styles/` removed
- [x] All Redux slices live under `features/*/model` (only `store/index.ts` remains for configureStore)
- [x] Component folder casing is camelCase under `features/*/components`
- [x] `npm run lint`, `npm run build`, `npm run knip` green

## Feature → content mapping (upcoming batches)

- **auth** (done): forms, guards, hooks, authSlice, types, validations, authApi
- **account** (done — shell): AccountContainer/Header/Actions/TabShell/Settings, CreateProfileStepper/Steps, ProfileInfo, ContactForm, CategorySelectorInput, Creator/UpdateCreator, SideBarImages, accountSidebarConfig, accountTabs, createProfile, useAccountSidebar, useDeleteAccount, accountApi
- **events** (done): event entity UI/hooks/api/types/validations; myEvents sidebar tab
- **eventBookings** (done): booking widget, manage tab, seats stepper, myEventBookings, booking hooks/types
- **eventInvitations** (done): invitations/participations tabs, EventDetailsWithParticipants, invitation hooks/types
- **places** (done): PlaceForm/Container, Create/UpdatePlaceContainer, DefaultSchedule*, PlaceCategoryBadge, place hooks/api/types/validations, schedule+timetable utils
- **map** (done): MapPageContainer, filters, cards, MapComponent/CategoryMarker, useMapViewState, map types/utils/constants (geocoding) — not `appSlice`
- **messages** (done): InboxContainer, Conversation*, Message*, PartnershipMessage, skeletons, useConversations/Messages/SendMessage/Socket, conversationsApi
- **notifications** (done): NavbarNotifications, NotificationsList, NotificationCard, notificationSlice, useUserNotifications, notificationsApi, translateNotificationAction
- **partnerships** (done): PartnershipsForm/List, Accepted/Received/Sent tabs+lists, PartnershipCard, partnership hooks/api/types — not EventPartnershipsSelect (events) nor PartnershipMessage (messages) nor MapCreatorCardPartnerships (map)
- **reviews** (done): ReviewsTab, ReviewCard, ReviewModal, Written/Received tabs, StarsDisplay/StarsReview, reviewsApi, review hooks/types
- **comments** (done): CommentInput, commentsApi, comment hooks/types — reply list UI stays in ReviewCard
- **follows** (done): FollowersTab, FollowingTab, FollowingCount, followsApi, follow hooks/types — not CreatorActionButtons (creator)
- **users** (done): UserProfileContainer, UserCard, CreatorCard, CreatorCardWithAddress, CreatorCategoryBadge, UsersListXScroll, GallerySection, usersApi, useUser/useFindUsers/useSubmitUser, user types/validations/userDisplay
- **creator** (done): CreatorHeader, CreatorTabs, PresentationTab, CreatorActionButtons, ProductCategoriesBadges, useCreatorData — not UpdateCreator (account) nor MapCreatorCard (map)
- **admin** (done): AdminUsersSearchContainer, AdminUserDetailContainer, AdminUserRow/SummaryCard/Tabs, AdminContentTable, adminApi, useAdminUsers — not UserRole (users) nor ProtectedRoute (auth)
- **home** (done): HomeHeader, SuggestionsList, UserSuggestionCard (+ skeleton), home utils — not EventSuggestion* (events) nor getHomeMetadata / EmptyState
- **favorites** (done): favoritesSlice, favoritesApi — not map favorites-mode UI nor CreatorActionButtons bookmark
- **products** (done): MyProductsTab, productsApi, useUserProducts/useSubmitProduct, product types — not ProductCategoriesBadges (creator) nor appSlice productCategories catalog
- **shared/ui** (done): design system ex-`components/common` (buttons, inputs, modals, loading, tabs, Footer, Avatar, SearchInput, …) — not LocationPicker/AddressInput (map) nor TimeSlotInputs (places)
- **layout/navbar** (done): Navbar shell + menus under `components/layout/navbar` — NavbarNotifications stays in notifications
- **shared/hooks|config|styles** (done): hooks (toast/loading/images/…), app config, styles/muiTheme; plus shared/types, shared/utils, shared/lib validations+pageMetadata
- **categories** (done): categoriesSlice (ex-appSlice), useCategories; entity metadata in `app/lib/`
