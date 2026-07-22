"use client";

import {
  Users,
  Inbox,
  UserPlus,
  Calendar,
  CalendarDays,
  Ticket,
  Star,
  MessageSquare,
  Leaf,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import PartnershipsReceivedTab from "@/features/partnerships/components/partnershipsReceivedTab";
import PartnershipsAcceptedTab from "@/features/partnerships/components/partnershipsAcceptedTab";
import PartnershipsSentTab from "@/features/partnerships/components/partnershipsSentTab";
import { MyEventsTab } from "@/features/events/components/sideBarEvents";
import MyEventBookingsTab from "@/features/eventBookings/components/myEventBookings/myEventBookingsTab";
import EventInvitationsReceivedTab from "@/features/eventInvitations/components/eventInvitationsReceived/eventInvitationsReceivedTab";
import EventParticipationsTab from "@/features/eventInvitations/components/eventParticipations/eventParticipationsTab";
import ReviewsWrittenTab from "@/features/reviews/components/reviewsWrittenTab";
import ReviewsReceivedTab from "@/features/reviews/components/reviewsReceivedTab";
import FollowersTab from "@/features/follows/components/followersTab";
import FollowingTab from "@/features/follows/components/followingTab";
import MyProductsTab from "@/features/products/components/myProductsTab";
import type { SideBarTab } from "@/shared/ui/sideBar";
import {
  SIDEBAR_VALUES,
  COLLABORATIONS_TAB_IDS,
  EVENTS_TAB_IDS,
  BOOKINGS_TAB_IDS,
  REVIEWS_TAB_IDS,
  FOLLOWS_TAB_IDS,
  PRODUCTS_TAB_IDS,
  IMAGES_TAB_IDS,
  type SidebarValue,
} from "../utils/accountTabs";
import AccountGalleryTab from "./sideBarImages/AccountGalleryTab";
import type { TFunction } from "i18next";

type ExtendedSideBarTab = Omit<SideBarTab, "label"> & {
  labelKey: string;
  display?: "all" | "creatorOnly" | "nonCreatorOnly";
};

const filterTabsForUser = (
  tabs: ExtendedSideBarTab[],
  isCreator: boolean,
): ExtendedSideBarTab[] =>
  tabs.filter((tab) => {
    if (!tab.display || tab.display === "all") return true;
    if (tab.display === "creatorOnly") return isCreator;
    if (tab.display === "nonCreatorOnly") return !isCreator;
    return true;
  });

export const COLLABORATIONS_TABS: ExtendedSideBarTab[] = [
  {
    id: COLLABORATIONS_TAB_IDS.COLLABORATORS,
    labelKey: "accountSidebarConfig.tabs.collaborators",
    icon: Users,
    content: <PartnershipsAcceptedTab />,
  },
  {
    id: COLLABORATIONS_TAB_IDS.RECEIVED_INVITATIONS,
    labelKey: "accountSidebarConfig.tabs.receivedInvitations",
    icon: Inbox,
    content: <PartnershipsReceivedTab />,
  },
  {
    id: COLLABORATIONS_TAB_IDS.INVITE,
    labelKey: "accountSidebarConfig.tabs.invite",
    icon: UserPlus,
    content: <PartnershipsSentTab />,
  },
];

export const EVENTS_TABS: ExtendedSideBarTab[] = [
  {
    id: EVENTS_TAB_IDS.MY_EVENTS,
    labelKey: "accountSidebarConfig.tabs.myEvents",
    icon: Calendar,
    content: <MyEventsTab />,
  },
  {
    id: EVENTS_TAB_IDS.RECEIVED_INVITATIONS,
    labelKey: "accountSidebarConfig.tabs.receivedInvitations",
    icon: Inbox,
    content: <EventInvitationsReceivedTab />,
  },
  {
    id: EVENTS_TAB_IDS.MY_PARTICIPATIONS,
    labelKey: "accountSidebarConfig.tabs.myParticipations",
    icon: CalendarDays,
    content: <EventParticipationsTab />,
  },
];

export const BOOKINGS_TABS: ExtendedSideBarTab[] = [
  {
    id: BOOKINGS_TAB_IDS.MY_BOOKINGS,
    labelKey: "accountSidebarConfig.tabs.myBookings",
    icon: Ticket,
    content: <MyEventBookingsTab />,
  },
];

export const REVIEWS_TABS: ExtendedSideBarTab[] = [
  {
    id: REVIEWS_TAB_IDS.WRITTEN,
    labelKey: "accountSidebarConfig.tabs.reviewsWritten",
    icon: MessageSquare,
    content: <ReviewsWrittenTab />,
  },
  {
    id: REVIEWS_TAB_IDS.RECEIVED,
    labelKey: "accountSidebarConfig.tabs.reviewsReceived",
    icon: Star,
    content: <ReviewsReceivedTab />,
    display: "creatorOnly",
  },
];

export const FOLLOWS_TABS: ExtendedSideBarTab[] = [
  {
    id: FOLLOWS_TAB_IDS.FOLLOWERS,
    labelKey: "accountSidebarConfig.tabs.followers",
    icon: Users,
    content: <FollowersTab />,
    display: "creatorOnly",
  },
  {
    id: FOLLOWS_TAB_IDS.FOLLOWING,
    labelKey: "accountSidebarConfig.tabs.following",
    icon: Leaf,
    content: <FollowingTab />,
  },
];

export const PRODUCTS_TABS: ExtendedSideBarTab[] = [
  {
    id: PRODUCTS_TAB_IDS.MY_PRODUCTS,
    labelKey: "accountSidebarConfig.tabs.myProducts",
    icon: Package,
    content: <MyProductsTab />,
  },
];

export const IMAGES_TABS: ExtendedSideBarTab[] = [
  {
    id: IMAGES_TAB_IDS.GALLERY,
    labelKey: "accountSidebarConfig.tabs.gallery",
    icon: ImageIcon,
    content: <AccountGalleryTab />,
    display: "creatorOnly",
  },
];

interface SidebarConfig {
  titleKey: string;
  tabs: ExtendedSideBarTab[];
  defaultTab: string;
  defaultTabCreator?: string;
}

export const SIDEBAR_REGISTRY: Record<SidebarValue, SidebarConfig> = {
  [SIDEBAR_VALUES.COLLABORATIONS]: {
    titleKey: "accountSidebarConfig.titles.collaborations",
    tabs: COLLABORATIONS_TABS,
    defaultTab: COLLABORATIONS_TAB_IDS.COLLABORATORS,
  },
  [SIDEBAR_VALUES.EVENTS]: {
    titleKey: "accountSidebarConfig.titles.events",
    tabs: EVENTS_TABS,
    defaultTab: EVENTS_TAB_IDS.MY_EVENTS,
  },
  [SIDEBAR_VALUES.BOOKINGS]: {
    titleKey: "accountSidebarConfig.titles.bookings",
    tabs: BOOKINGS_TABS,
    defaultTab: BOOKINGS_TAB_IDS.MY_BOOKINGS,
  },
  [SIDEBAR_VALUES.REVIEWS]: {
    titleKey: "accountSidebarConfig.titles.reviews",
    tabs: REVIEWS_TABS,
    defaultTab: REVIEWS_TAB_IDS.WRITTEN,
  },
  [SIDEBAR_VALUES.FOLLOWS]: {
    titleKey: "accountSidebarConfig.titles.follows",
    tabs: FOLLOWS_TABS,
    defaultTab: FOLLOWS_TAB_IDS.FOLLOWING,
    defaultTabCreator: FOLLOWS_TAB_IDS.FOLLOWERS,
  },
  [SIDEBAR_VALUES.PRODUCTS]: {
    titleKey: "accountSidebarConfig.titles.products",
    tabs: PRODUCTS_TABS,
    defaultTab: PRODUCTS_TAB_IDS.MY_PRODUCTS,
  },
  [SIDEBAR_VALUES.IMAGES]: {
    titleKey: "accountSidebarConfig.titles.images",
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
  options?: { isCreator?: boolean; t?: TFunction<"account"> },
): SidebarState {
  const config = activeSidebar ? SIDEBAR_REGISTRY[activeSidebar] : null;
  if (!config || !options?.t) return { title: "", tabs: [], initialTabId: "" };

  const { t, isCreator = false } = options;
  const filteredTabs = filterTabsForUser(config.tabs, isCreator);
  const tabs: SideBarTab[] = filteredTabs.map(({ labelKey, ...tab }) => ({
    ...tab,
    label: t(labelKey),
  }));
  const defaultTab =
    isCreator && config.defaultTabCreator
      ? config.defaultTabCreator
      : config.defaultTab;
  const initialTabId =
    activeTab && tabs.some((tabItem) => tabItem.id === activeTab)
      ? activeTab
      : (tabs[0]?.id ?? defaultTab);

  return { title: t(config.titleKey), tabs, initialTabId };
}
