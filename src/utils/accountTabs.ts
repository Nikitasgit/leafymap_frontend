import type { Notification } from "@/types/notifications";

interface RouterPush {
  push: (url: string) => void;
}

export const ACCOUNT_TAB_IDS = {
  COLLABORATORS: "collaborators",
  RECEIVED_INVITATIONS: "received-invitations",
  INVITE: "invite",
} as const;

export type AccountTabId =
  (typeof ACCOUNT_TAB_IDS)[keyof typeof ACCOUNT_TAB_IDS];

const ACCOUNT_PATH = "/account";

export const ACCOUNT_SIDEBAR_TAB_PARAM = "sideBarTab";

export function getAccountCollaborationsPath(tabId?: AccountTabId): string {
  if (!tabId) return ACCOUNT_PATH;
  return `${ACCOUNT_PATH}?${ACCOUNT_SIDEBAR_TAB_PARAM}=${tabId}`;
}

export function getNotificationRedirectPath(
  notification: Notification
): string | null {
  if (
    notification.action === "partnership_invitation" &&
    notification.referenceType === "Partnership"
  ) {
    return getAccountCollaborationsPath(ACCOUNT_TAB_IDS.RECEIVED_INVITATIONS);
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
