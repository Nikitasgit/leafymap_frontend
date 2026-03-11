import type { Notification } from "@/types/notifications";

interface RouterPush {
  push: (url: string) => void;
}

const ACCOUNT_PATH = "/account";

/** Paramètre URL : quelle sidebar est ouverte (collaborations ou events) */
export const SIDEBAR_PARAM = "sidebar";

/** Paramètre URL : onglet actif dans la sidebar (sens selon sidebar) */
export const TAB_PARAM = "tab";

export const SIDEBAR_VALUES = {
  COLLABORATIONS: "collaborations",
  EVENTS: "events",
  REVIEWS: "reviews",
  FOLLOWS: "follows",
  PRODUCTS: "products",
  IMAGES: "images",
} as const;

export type SidebarValue = (typeof SIDEBAR_VALUES)[keyof typeof SIDEBAR_VALUES];

/** Onglets de la sidebar Collaborations */
export const COLLABORATIONS_TAB_IDS = {
  COLLABORATORS: "collaborators",
  RECEIVED_INVITATIONS: "received-invitations",
  INVITE: "invite",
} as const;

export type CollaborationsTabId =
  (typeof COLLABORATIONS_TAB_IDS)[keyof typeof COLLABORATIONS_TAB_IDS];

/** Onglets de la sidebar Évènements */
export const EVENTS_TAB_IDS = {
  MY_EVENTS: "my-events",
  RECEIVED_INVITATIONS: "received-invitations",
  MY_PARTICIPATIONS: "my-participations",
} as const;

export type EventsTabId = (typeof EVENTS_TAB_IDS)[keyof typeof EVENTS_TAB_IDS];

/** Onglets de la sidebar Avis */
export const REVIEWS_TAB_IDS = {
  WRITTEN: "written",
  RECEIVED: "received",
} as const;

export type ReviewsTabId =
  (typeof REVIEWS_TAB_IDS)[keyof typeof REVIEWS_TAB_IDS];

/** Onglets de la sidebar Abonnements */
export const FOLLOWS_TAB_IDS = {
  FOLLOWERS: "followers",
  FOLLOWING: "following",
} as const;

export type FollowsTabId =
  (typeof FOLLOWS_TAB_IDS)[keyof typeof FOLLOWS_TAB_IDS];

/** Onglets de la sidebar Produits */
export const PRODUCTS_TAB_IDS = {
  MY_PRODUCTS: "my-products",
} as const;

export type ProductsTabId =
  (typeof PRODUCTS_TAB_IDS)[keyof typeof PRODUCTS_TAB_IDS];

/** Onglets de la sidebar Images */
export const IMAGES_TAB_IDS = {
  GALLERY: "gallery",
} as const;

export type ImagesTabId =
  (typeof IMAGES_TAB_IDS)[keyof typeof IMAGES_TAB_IDS];

/**
 * Construit l’URL /account avec au plus les paramètres sidebar et tab.
 * Une seule sidebar peut être ouverte : sidebar=collaborations ou sidebar=events.
 */
export function getAccountPathWithSidebar(
  searchParams: URLSearchParams,
  sidebar: SidebarValue | null,
  tab: string | null
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(SIDEBAR_PARAM);
  params.delete(TAB_PARAM);
  if (sidebar) {
    params.set(SIDEBAR_PARAM, sidebar);
    if (tab) {
      params.set(TAB_PARAM, tab);
    }
  }
  const query = params.toString();
  return query ? `${ACCOUNT_PATH}?${query}` : ACCOUNT_PATH;
}

/** Lien vers la page compte avec une sidebar ouverte */
export function getAccountSidebarPath(
  sidebar: SidebarValue,
  tabId?: string
): string {
  if (!tabId) return ACCOUNT_PATH;
  return `${ACCOUNT_PATH}?${SIDEBAR_PARAM}=${sidebar}&${TAB_PARAM}=${tabId}`;
}

export function getNotificationRedirectPath(
  notification: Notification
): string | null {
  if (
    notification.action === "partnership_invitation" &&
    notification.referenceType === "Partnership"
  ) {
    return getAccountSidebarPath(
      SIDEBAR_VALUES.COLLABORATIONS,
      COLLABORATIONS_TAB_IDS.RECEIVED_INVITATIONS
    );
  }
  if (
    notification.action === "event_invitation" &&
    notification.referenceType === "Event"
  ) {
    return getAccountSidebarPath(
      SIDEBAR_VALUES.EVENTS,
      EVENTS_TAB_IDS.RECEIVED_INVITATIONS
    );
  }
  if (
    notification.action === "new_follower" &&
    notification.referenceType === "Follow"
  ) {
    return getAccountSidebarPath(
      SIDEBAR_VALUES.FOLLOWS,
      FOLLOWS_TAB_IDS.FOLLOWERS
    );
  }
  return null;
}

export function handleNotificationRedirect(
  notification: Notification,
  router: RouterPush,
  onBeforeRedirect?: () => void
): boolean {
  const path = getNotificationRedirectPath(notification);
  if (!path) return false;
  onBeforeRedirect?.();
  router.push(path);
  return true;
}
