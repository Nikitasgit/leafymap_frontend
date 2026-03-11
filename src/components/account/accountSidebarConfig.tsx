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
  Image as ImageIcon,
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
  IMAGES_TAB_IDS,
  type SidebarValue,
} from "@/utils/accountTabs";
import AccountGalleryTab from "@/components/account/SideBarImages/AccountGalleryTab";

type ExtendedSideBarTab = SideBarTab & {
  display?: "all" | "creatorOnly" | "nonCreatorOnly";
};

const filterTabsForUser = (
  tabs: ExtendedSideBarTab[],
  isCreator: boolean
): SideBarTab[] =>
  tabs.filter((tab) => {
    if (!tab.display || tab.display === "all") return true;
    if (tab.display === "creatorOnly") return isCreator;
    if (tab.display === "nonCreatorOnly") return !isCreator;
    return true;
  });

export const COLLABORATIONS_TABS: ExtendedSideBarTab[] = [
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

export const EVENTS_TABS: ExtendedSideBarTab[] = [
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

export const REVIEWS_TABS: ExtendedSideBarTab[] = [
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
    display: "creatorOnly",
  },
];

export const FOLLOWS_TABS: ExtendedSideBarTab[] = [
  {
    id: FOLLOWS_TAB_IDS.FOLLOWERS,
    label: "Abonnés",
    icon: Users,
    content: <FollowersTab />,
    display: "creatorOnly",
  },
  {
    id: FOLLOWS_TAB_IDS.FOLLOWING,
    label: "Abonnements",
    icon: Leaf,
    content: <FollowingTab />,
  },
];

export const PRODUCTS_TABS: ExtendedSideBarTab[] = [
  {
    id: PRODUCTS_TAB_IDS.MY_PRODUCTS,
    label: "Mes produits",
    icon: Package,
    content: <MyProductsTab />,
  },
];

export const IMAGES_TABS: ExtendedSideBarTab[] = [
  {
    id: IMAGES_TAB_IDS.GALLERY,
    label: "Images",
    icon: ImageIcon,
    content: <AccountGalleryTab />,
    display: "creatorOnly",
  },
];

interface SidebarConfig {
  title: string;
  tabs: ExtendedSideBarTab[];
  defaultTab: string;
  defaultTabCreator?: string;
}

export const SIDEBAR_REGISTRY: Record<SidebarValue, SidebarConfig> = {
  [SIDEBAR_VALUES.COLLABORATIONS]: {
    title: "Collaborations",
    tabs: COLLABORATIONS_TABS,
    defaultTab: COLLABORATIONS_TAB_IDS.COLLABORATORS,
  },
  [SIDEBAR_VALUES.EVENTS]: {
    title: "Mes évènements",
    tabs: EVENTS_TABS,
    defaultTab: EVENTS_TAB_IDS.MY_EVENTS,
  },
  [SIDEBAR_VALUES.REVIEWS]: {
    title: "Avis",
    tabs: REVIEWS_TABS,
    defaultTab: REVIEWS_TAB_IDS.WRITTEN,
  },
  [SIDEBAR_VALUES.FOLLOWS]: {
    title: "Abonnements",
    tabs: FOLLOWS_TABS,
    defaultTab: FOLLOWS_TAB_IDS.FOLLOWING,
    defaultTabCreator: FOLLOWS_TAB_IDS.FOLLOWERS,
  },
  [SIDEBAR_VALUES.PRODUCTS]: {
    title: "Produits",
    tabs: PRODUCTS_TABS,
    defaultTab: PRODUCTS_TAB_IDS.MY_PRODUCTS,
  },
  [SIDEBAR_VALUES.IMAGES]: {
    title: "Images",
    tabs: IMAGES_TABS,
    defaultTab: IMAGES_TAB_IDS.GALLERY,
  },
};

export interface SidebarState {
  title: string;
  tabs: SideBarTab[];
  initialTabId: string;
}

export function getSidebarState(
  activeSidebar: SidebarValue | null,
  activeTab: string | null,
  options?: { isCreator?: boolean }
): SidebarState {
  const config = activeSidebar ? SIDEBAR_REGISTRY[activeSidebar] : null;
  if (!config) return { title: "", tabs: [], initialTabId: "" };

  const isCreator = options?.isCreator ?? false;
  const tabs = filterTabsForUser(config.tabs, isCreator);
  const defaultTab =
    isCreator && config.defaultTabCreator
      ? config.defaultTabCreator
      : config.defaultTab;
  const initialTabId =
    activeTab && tabs.some((t) => t.id === activeTab)
      ? activeTab
      : (tabs[0]?.id ?? defaultTab);

  return { title: config.title, tabs, initialTabId };
}
