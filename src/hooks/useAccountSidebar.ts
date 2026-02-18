"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import {
  SIDEBAR_PARAM,
  TAB_PARAM,
  SIDEBAR_VALUES,
  COLLABORATIONS_TAB_IDS,
  EVENTS_TAB_IDS,
  REVIEWS_TAB_IDS,
  FOLLOWS_TAB_IDS,
  PRODUCTS_TAB_IDS,
  getAccountPathWithSidebar,
  type SidebarValue,
} from "@/utils/accountTabs";
import { getSidebarState } from "@/components/account/accountSidebarConfig";
import type { UserPopulated } from "@/types/user";

export interface UseAccountSidebarResult {
  isSideBarOpen: boolean;
  title: string;
  tabs: ReturnType<typeof getSidebarState>["tabs"];
  initialTabId: string;
  onClose: () => void;
  onTabChange: (tabId: string) => void;
  onOpenCollaborations: () => void;
  onOpenEvents: () => void;
  onOpenReviews: () => void;
  onOpenFollows: () => void;
  onOpenProducts: () => void;
}

export function useAccountSidebar(
  user: UserPopulated | null
): UseAccountSidebarResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { markPartnershipInvitationsAsRead, markEventInvitationsAsRead } =
    useUserNotifications({
      autoFetch: !!user,
    });

  const activeSidebar = searchParams.get(SIDEBAR_PARAM) as SidebarValue | null;
  const activeTab = searchParams.get(TAB_PARAM);

  const isSideBarOpen =
    activeSidebar === SIDEBAR_VALUES.COLLABORATIONS ||
    activeSidebar === SIDEBAR_VALUES.EVENTS ||
    activeSidebar === SIDEBAR_VALUES.REVIEWS ||
    activeSidebar === SIDEBAR_VALUES.FOLLOWS ||
    activeSidebar === SIDEBAR_VALUES.PRODUCTS;

  const { title, tabs, initialTabId } = useMemo(
    () => getSidebarState(activeSidebar, activeTab),
    [activeSidebar, activeTab]
  );

  const navigateSidebar = useCallback(
    (sidebar: SidebarValue | null, tab: string | null) => {
      router.replace(getAccountPathWithSidebar(searchParams, sidebar, tab));
    },
    [router, searchParams]
  );

  const onClose = useCallback(() => {
    navigateSidebar(null, null);
  }, [navigateSidebar]);

  const onTabChange = useCallback(
    (tabId: string) => {
      if (activeSidebar === SIDEBAR_VALUES.COLLABORATIONS) {
        if (tabId === COLLABORATIONS_TAB_IDS.RECEIVED_INVITATIONS) {
          markPartnershipInvitationsAsRead();
        }
        navigateSidebar(SIDEBAR_VALUES.COLLABORATIONS, tabId);
      } else if (activeSidebar === SIDEBAR_VALUES.EVENTS) {
        if (tabId === EVENTS_TAB_IDS.RECEIVED_INVITATIONS) {
          markEventInvitationsAsRead();
        }
        navigateSidebar(SIDEBAR_VALUES.EVENTS, tabId);
      } else if (activeSidebar === SIDEBAR_VALUES.REVIEWS) {
        navigateSidebar(SIDEBAR_VALUES.REVIEWS, tabId);
      } else if (activeSidebar === SIDEBAR_VALUES.FOLLOWS) {
        navigateSidebar(SIDEBAR_VALUES.FOLLOWS, tabId);
      } else if (activeSidebar === SIDEBAR_VALUES.PRODUCTS) {
        navigateSidebar(SIDEBAR_VALUES.PRODUCTS, tabId);
      }
    },
    [
      activeSidebar,
      navigateSidebar,
      markPartnershipInvitationsAsRead,
      markEventInvitationsAsRead,
    ]
  );

  const onOpenCollaborations = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.COLLABORATIONS) {
      navigateSidebar(null, null);
    } else {
      navigateSidebar(
        SIDEBAR_VALUES.COLLABORATIONS,
        COLLABORATIONS_TAB_IDS.COLLABORATORS
      );
    }
  }, [activeSidebar, navigateSidebar]);

  const onOpenEvents = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.EVENTS) {
      navigateSidebar(null, null);
    } else {
      navigateSidebar(SIDEBAR_VALUES.EVENTS, EVENTS_TAB_IDS.MY_EVENTS);
    }
  }, [activeSidebar, navigateSidebar]);

  const onOpenReviews = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.REVIEWS) {
      navigateSidebar(null, null);
    } else {
      navigateSidebar(SIDEBAR_VALUES.REVIEWS, REVIEWS_TAB_IDS.WRITTEN);
    }
  }, [activeSidebar, navigateSidebar]);

  const onOpenFollows = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.FOLLOWS) {
      navigateSidebar(null, null);
    } else {
      navigateSidebar(SIDEBAR_VALUES.FOLLOWS, FOLLOWS_TAB_IDS.FOLLOWERS);
    }
  }, [activeSidebar, navigateSidebar]);

  const onOpenProducts = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.PRODUCTS) {
      navigateSidebar(null, null);
    } else {
      navigateSidebar(SIDEBAR_VALUES.PRODUCTS, PRODUCTS_TAB_IDS.MY_PRODUCTS);
    }
  }, [activeSidebar, navigateSidebar]);

  return {
    isSideBarOpen,
    title,
    tabs,
    initialTabId,
    onClose,
    onTabChange,
    onOpenCollaborations,
    onOpenEvents,
    onOpenReviews,
    onOpenFollows,
    onOpenProducts,
  };
}
