"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Inbox,
  UserPlus,
  CalendarDays,
  Star,
  MessageSquare,
  Leaf,
} from "lucide-react";
import AccountPlaceCard from "@/components/account/AccountPlaceCard/AccountPlaceCard";
import AccountHeader from "@/components/account/AccountHeader";
import AccountActions from "@/components/account/AccountActions";
import TitleWithLine from "@/components/common/typography/TitleWithLine";
import { SideBar } from "@/components/common/SideBar";
import {
  PartnershipsReceivedTab,
  PartnershipsAcceptedTab,
  PartnershipsSentTab,
} from "@/components/account/SideBarCollaborations";
import {
  EventInvitationsReceivedTab,
  EventParticipationsTab,
} from "@/components/account/SideBarEvents";
import {
  ReviewsWrittenTab,
  ReviewsReceivedTab,
} from "@/components/account/SideBarReviews";
import { FollowersTab, FollowingTab } from "@/components/account/SideBarFollows";
import styles from "./AccountContainer.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import {
  SIDEBAR_PARAM,
  TAB_PARAM,
  SIDEBAR_VALUES,
  COLLABORATIONS_TAB_IDS,
  EVENTS_TAB_IDS,
  REVIEWS_TAB_IDS,
  FOLLOWS_TAB_IDS,
  getAccountPathWithSidebar,
  type SidebarValue,
  type CollaborationsTabId,
  type EventsTabId,
  type ReviewsTabId,
  type FollowsTabId,
} from "@/utils/accountTabs";

const COLLABORATIONS_TABS = [
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

const EVENTS_TABS = [
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

const REVIEWS_TABS = [
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

const FOLLOWS_TABS = [
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

function isValidCollaborationsTab(
  tab: string | null
): tab is CollaborationsTabId {
  return (
    tab !== null &&
    Object.values(COLLABORATIONS_TAB_IDS).includes(tab as CollaborationsTabId)
  );
}

function isValidEventsTab(tab: string | null): tab is EventsTabId {
  return (
    tab !== null && Object.values(EVENTS_TAB_IDS).includes(tab as EventsTabId)
  );
}

function isValidReviewsTab(tab: string | null): tab is ReviewsTabId {
  return (
    tab !== null &&
    Object.values(REVIEWS_TAB_IDS).includes(tab as ReviewsTabId)
  );
}

function isValidFollowsTab(tab: string | null): tab is FollowsTabId {
  return (
    tab !== null &&
    Object.values(FOLLOWS_TAB_IDS).includes(tab as FollowsTabId)
  );
}

export default function AccountContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
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
    activeSidebar === SIDEBAR_VALUES.FOLLOWS;

  const { title, tabs, initialTabId } = useMemo(() => {
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
        : EVENTS_TAB_IDS.RECEIVED_INVITATIONS;
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
    return {
      title: "",
      tabs: COLLABORATIONS_TABS,
      initialTabId: COLLABORATIONS_TAB_IDS.COLLABORATORS,
    };
  }, [activeSidebar, activeTab]);

  const navigateSidebar = useCallback(
    (sidebar: SidebarValue | null, tab: string | null) => {
      router.replace(getAccountPathWithSidebar(searchParams, sidebar, tab));
    },
    [router, searchParams]
  );

  const handleCloseSideBar = useCallback(() => {
    navigateSidebar(null, null);
  }, [navigateSidebar]);

  const handleTabChange = useCallback(
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
      }
    },
    [
      activeSidebar,
      navigateSidebar,
      markPartnershipInvitationsAsRead,
      markEventInvitationsAsRead,
    ]
  );

  const handleOpenCollaborations = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.COLLABORATIONS) {
      handleCloseSideBar();
    } else {
      navigateSidebar(
        SIDEBAR_VALUES.COLLABORATIONS,
        COLLABORATIONS_TAB_IDS.COLLABORATORS
      );
    }
  }, [activeSidebar, handleCloseSideBar, navigateSidebar]);

  const handleOpenEvents = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.EVENTS) {
      handleCloseSideBar();
    } else {
      navigateSidebar(
        SIDEBAR_VALUES.EVENTS,
        EVENTS_TAB_IDS.RECEIVED_INVITATIONS
      );
    }
  }, [activeSidebar, handleCloseSideBar, navigateSidebar]);

  const handleOpenReviews = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.REVIEWS) {
      handleCloseSideBar();
    } else {
      navigateSidebar(SIDEBAR_VALUES.REVIEWS, REVIEWS_TAB_IDS.WRITTEN);
    }
  }, [activeSidebar, handleCloseSideBar, navigateSidebar]);

  const handleOpenFollows = useCallback(() => {
    if (activeSidebar === SIDEBAR_VALUES.FOLLOWS) {
      handleCloseSideBar();
    } else {
      navigateSidebar(SIDEBAR_VALUES.FOLLOWS, FOLLOWS_TAB_IDS.FOLLOWERS);
    }
  }, [activeSidebar, handleCloseSideBar, navigateSidebar]);

  if (isLoadingUser) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.accountLayout}>
      <SideBar
        title={title}
        isOpen={isSideBarOpen}
        onClose={handleCloseSideBar}
        initialTabId={initialTabId}
        onTabChange={handleTabChange}
        tabs={tabs}
      />
      <div className={styles.accountContainer}>
        <AccountHeader user={user!} isLoadingUser={isLoadingUser} />
        <AccountActions
          user={user!}
          isLoadingUser={isLoadingUser}
          onOpenCollaborations={handleOpenCollaborations}
          onOpenEvents={handleOpenEvents}
          onOpenReviews={handleOpenReviews}
          onOpenFollows={handleOpenFollows}
        />
        {user?.place && typeof user.place === "object" && (
          <div>
            <TitleWithLine>Votre lieu</TitleWithLine>
            <AccountPlaceCard place={user.place} />
          </div>
        )}
      </div>
    </div>
  );
}
