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
  getAccountPathWithSidebar,
  type SidebarValue,
} from "@/utils/accountTabs";
import {
  getSidebarState,
  SIDEBAR_REGISTRY,
} from "@/components/account/accountSidebarConfig";
import type { UserPopulated } from "@/types/user";

export interface UseAccountSidebarResult {
  isSideBarOpen: boolean;
  title: string;
  tabs: ReturnType<typeof getSidebarState>["tabs"];
  initialTabId: string;
  onClose: () => void;
  onTabChange: (tabId: string) => void;
  toggleSidebar: (sidebar: SidebarValue) => void;
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

  const isCreator = user?.userType === "creator";

  const sidebarValues = Object.values(SIDEBAR_VALUES) as string[];
  const isSideBarOpen =
    activeSidebar != null && sidebarValues.includes(activeSidebar);

  const { title, tabs, initialTabId } = useMemo(
    () => getSidebarState(activeSidebar, activeTab, { isCreator }),
    [activeSidebar, activeTab, isCreator]
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
      if (!activeSidebar) return;

      const sideEffects: Partial<
        Record<SidebarValue, Record<string, () => void>>
      > = {
        [SIDEBAR_VALUES.COLLABORATIONS]: {
          [COLLABORATIONS_TAB_IDS.RECEIVED_INVITATIONS]:
            markPartnershipInvitationsAsRead,
        },
        [SIDEBAR_VALUES.EVENTS]: {
          [EVENTS_TAB_IDS.RECEIVED_INVITATIONS]: markEventInvitationsAsRead,
        },
      };

      sideEffects[activeSidebar]?.[tabId]?.();
      navigateSidebar(activeSidebar, tabId);
    },
    [
      activeSidebar,
      navigateSidebar,
      markPartnershipInvitationsAsRead,
      markEventInvitationsAsRead,
    ]
  );

  const toggleSidebar = useCallback(
    (sidebar: SidebarValue) => {
      if (activeSidebar === sidebar) {
        navigateSidebar(null, null);
      } else {
        const config = SIDEBAR_REGISTRY[sidebar];
        const defaultTab =
          isCreator && config.defaultTabCreator
            ? config.defaultTabCreator
            : config.defaultTab;
        navigateSidebar(sidebar, defaultTab);
      }
    },
    [activeSidebar, navigateSidebar, isCreator]
  );

  return {
    isSideBarOpen,
    title,
    tabs,
    initialTabId,
    onClose,
    onTabChange,
    toggleSidebar,
  };
}
