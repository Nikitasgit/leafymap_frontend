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

/** Lien vers la page compte avec la sidebar Collaborations ouverte (ex: notifications) */
export function getAccountCollaborationsPath(
  tabId?: CollaborationsTabId
): string {
  if (!tabId) return ACCOUNT_PATH;
  return `${ACCOUNT_PATH}?${SIDEBAR_PARAM}=${SIDEBAR_VALUES.COLLABORATIONS}&${TAB_PARAM}=${tabId}`;
}

/** Lien vers la page compte avec la sidebar Évènements ouverte (ex: notifications) */
export function getAccountEventsPath(tabId?: EventsTabId): string {
  if (!tabId) return ACCOUNT_PATH;
  return `${ACCOUNT_PATH}?${SIDEBAR_PARAM}=${SIDEBAR_VALUES.EVENTS}&${TAB_PARAM}=${tabId}`;
}

/** Lien vers la page compte avec la sidebar Avis ouverte */
export function getAccountReviewsPath(tabId?: ReviewsTabId): string {
  if (!tabId) return ACCOUNT_PATH;
  return `${ACCOUNT_PATH}?${SIDEBAR_PARAM}=${SIDEBAR_VALUES.REVIEWS}&${TAB_PARAM}=${tabId}`;
}

export function getNotificationRedirectPath(
  notification: Notification
): string | null {
  if (
    notification.action === "partnership_invitation" &&
    notification.referenceType === "Partnership"
  ) {
    return getAccountCollaborationsPath(
      COLLABORATIONS_TAB_IDS.RECEIVED_INVITATIONS
    );
  }
  if (
    notification.action === "event_invitation" &&
    notification.referenceType === "Event"
  ) {
    return getAccountEventsPath(EVENTS_TAB_IDS.RECEIVED_INVITATIONS);
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
