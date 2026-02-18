"use client";

import {
  Users,
  Inbox,
  UserPlus,
  Calendar,
  CalendarDays,
  Star,
  MessageSquare,
  Leaf,
  Package,
} from "lucide-react";
import {
  PartnershipsReceivedTab,
  PartnershipsAcceptedTab,
  PartnershipsSentTab,
} from "@/components/account/SideBarCollaborations";
import {
  EventInvitationsReceivedTab,
  EventParticipationsTab,
  MyEventsTab,
} from "@/components/account/SideBarEvents";
import {
  ReviewsWrittenTab,
  ReviewsReceivedTab,
} from "@/components/account/SideBarReviews";
import {
  FollowersTab,
  FollowingTab,
} from "@/components/account/SideBarFollows";
import { MyProductsTab } from "@/components/account/SideBarProducts/MyProductsTab";
import type { SideBarTab } from "@/components/common/SideBar/SideBar";
import {
  SIDEBAR_VALUES,
  COLLABORATIONS_TAB_IDS,
  EVENTS_TAB_IDS,
  REVIEWS_TAB_IDS,
  FOLLOWS_TAB_IDS,
  PRODUCTS_TAB_IDS,
  type SidebarValue,
  type CollaborationsTabId,
  type EventsTabId,
  type ReviewsTabId,
  type FollowsTabId,
  type ProductsTabId,
} from "@/utils/accountTabs";

export const COLLABORATIONS_TABS: SideBarTab[] = [
  {
    id: COLLABORATIONS_TAB_IDS.COLLABORATORS,
    label: "Mes collaborateurs",
    icon: Users,
    content: <PartnershipsAcceptedTab />,
  },
  {
    id: COLLABORATIONS_TAB_IDS.RECEIVED_INVITATIONS,
    label: "Invitations reçues",
    icon: Inbox,
    content: <PartnershipsReceivedTab />,
  },
  {
    id: COLLABORATIONS_TAB_IDS.INVITE,
    label: "Inviter",
    icon: UserPlus,
    content: <PartnershipsSentTab />,
  },
];

export const EVENTS_TABS: SideBarTab[] = [
  {
    id: EVENTS_TAB_IDS.MY_EVENTS,
    label: "Mes évènements",
    icon: Calendar,
    content: <MyEventsTab />,
  },
  {
    id: EVENTS_TAB_IDS.RECEIVED_INVITATIONS,
    label: "Invitations reçues",
    icon: Inbox,
    content: <EventInvitationsReceivedTab />,
  },
  {
    id: EVENTS_TAB_IDS.MY_PARTICIPATIONS,
    label: "Mes participations",
    icon: CalendarDays,
    content: <EventParticipationsTab />,
  },
];

export const REVIEWS_TABS: SideBarTab[] = [
  {
    id: REVIEWS_TAB_IDS.WRITTEN,
    label: "Avis rédigés",
    icon: MessageSquare,
    content: <ReviewsWrittenTab />,
  },
  {
    id: REVIEWS_TAB_IDS.RECEIVED,
    label: "Avis reçus",
    icon: Star,
    content: <ReviewsReceivedTab />,
  },
];

export const FOLLOWS_TABS: SideBarTab[] = [
  {
    id: FOLLOWS_TAB_IDS.FOLLOWERS,
    label: "Abonnés",
    icon: Users,
    content: <FollowersTab />,
  },
  {
    id: FOLLOWS_TAB_IDS.FOLLOWING,
    label: "Abonnements",
    icon: Leaf,
    content: <FollowingTab />,
  },
];

export const PRODUCTS_TABS: SideBarTab[] = [
  {
    id: PRODUCTS_TAB_IDS.MY_PRODUCTS,
    label: "Mes produits",
    icon: Package,
    content: <MyProductsTab />,
  },
];

export function isValidCollaborationsTab(
  tab: string | null
): tab is CollaborationsTabId {
  return (
    tab !== null &&
    Object.values(COLLABORATIONS_TAB_IDS).includes(tab as CollaborationsTabId)
  );
}

export function isValidEventsTab(tab: string | null): tab is EventsTabId {
  return (
    tab !== null && Object.values(EVENTS_TAB_IDS).includes(tab as EventsTabId)
  );
}

export function isValidReviewsTab(tab: string | null): tab is ReviewsTabId {
  return (
    tab !== null && Object.values(REVIEWS_TAB_IDS).includes(tab as ReviewsTabId)
  );
}

export function isValidFollowsTab(tab: string | null): tab is FollowsTabId {
  return (
    tab !== null && Object.values(FOLLOWS_TAB_IDS).includes(tab as FollowsTabId)
  );
}

export function isValidProductsTab(tab: string | null): tab is ProductsTabId {
  return (
    tab !== null &&
    Object.values(PRODUCTS_TAB_IDS).includes(tab as ProductsTabId)
  );
}

export interface SidebarState {
  title: string;
  tabs: SideBarTab[];
  initialTabId: string;
}

export function getSidebarState(
  activeSidebar: SidebarValue | null,
  activeTab: string | null
): SidebarState {
  if (activeSidebar === SIDEBAR_VALUES.COLLABORATIONS) {
    const tabId = isValidCollaborationsTab(activeTab)
      ? activeTab
      : COLLABORATIONS_TAB_IDS.COLLABORATORS;
    return {
      title: "Collaborations",
      tabs: COLLABORATIONS_TABS,
      initialTabId: tabId,
    };
  }
  if (activeSidebar === SIDEBAR_VALUES.EVENTS) {
    const tabId = isValidEventsTab(activeTab)
      ? activeTab
      : EVENTS_TAB_IDS.MY_EVENTS;
    return {
      title: "Mes évènements",
      tabs: EVENTS_TABS,
      initialTabId: tabId,
    };
  }
  if (activeSidebar === SIDEBAR_VALUES.REVIEWS) {
    const tabId = isValidReviewsTab(activeTab)
      ? activeTab
      : REVIEWS_TAB_IDS.WRITTEN;
    return {
      title: "Avis",
      tabs: REVIEWS_TABS,
      initialTabId: tabId,
    };
  }
  if (activeSidebar === SIDEBAR_VALUES.FOLLOWS) {
    const tabId = isValidFollowsTab(activeTab)
      ? activeTab
      : FOLLOWS_TAB_IDS.FOLLOWERS;
    return {
      title: "Abonnements",
      tabs: FOLLOWS_TABS,
      initialTabId: tabId,
    };
  }
  if (activeSidebar === SIDEBAR_VALUES.PRODUCTS) {
    const tabId = isValidProductsTab(activeTab)
      ? activeTab
      : PRODUCTS_TAB_IDS.MY_PRODUCTS;
    return {
      title: "Produits",
      tabs: PRODUCTS_TABS,
      initialTabId: tabId,
    };
  }
  return {
    title: "",
    tabs: COLLABORATIONS_TABS,
    initialTabId: COLLABORATIONS_TAB_IDS.COLLABORATORS,
  };
}
