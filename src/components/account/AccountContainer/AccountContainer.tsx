"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Users, Inbox, UserPlus } from "lucide-react";
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
import styles from "./AccountContainer.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserNotifications } from "@/hooks/useUserNotifications";
import {
  ACCOUNT_TAB_IDS,
  ACCOUNT_SIDEBAR_TAB_PARAM,
} from "@/utils/accountTabs";

export default function AccountContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [initialTabId, setInitialTabId] = useState<string | undefined>();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { markPartnershipInvitationsAsRead } = useUserNotifications({
    autoFetch: !!user,
  });

  useEffect(() => {
    const sideBarTab = searchParams.get(ACCOUNT_SIDEBAR_TAB_PARAM);
    if (sideBarTab === ACCOUNT_TAB_IDS.RECEIVED_INVITATIONS) {
      setIsSideBarOpen(true);
      setInitialTabId(ACCOUNT_TAB_IDS.RECEIVED_INVITATIONS);
    }
  }, [searchParams]);

  const handleCloseSideBar = useCallback(() => {
    setIsSideBarOpen(false);
    if (searchParams.get(ACCOUNT_SIDEBAR_TAB_PARAM)) {
      router.replace("/account");
    }
  }, [router, searchParams]);

  if (isLoadingUser) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.accountLayout}>
      <SideBar
        title="Collaborations"
        isOpen={isSideBarOpen}
        onClose={handleCloseSideBar}
        initialTabId={initialTabId}
        onTabChange={(tabId) => {
          if (tabId === ACCOUNT_TAB_IDS.RECEIVED_INVITATIONS) {
            markPartnershipInvitationsAsRead();
          }
        }}
        tabs={[
          {
            id: ACCOUNT_TAB_IDS.COLLABORATORS,
            label: "Mes collaborateurs",
            icon: Users,
            content: <PartnershipsAcceptedTab />,
          },
          {
            id: ACCOUNT_TAB_IDS.RECEIVED_INVITATIONS,
            label: "Invitations reçues",
            icon: Inbox,
            content: <PartnershipsReceivedTab />,
          },
          {
            id: ACCOUNT_TAB_IDS.INVITE,
            label: "Inviter",
            icon: UserPlus,
            content: <PartnershipsSentTab />,
          },
        ]}
      />
      <div className={styles.accountContainer}>
        <AccountHeader user={user!} isLoadingUser={isLoadingUser} />
        <AccountActions
          user={user!}
          isLoadingUser={isLoadingUser}
          onOpenCollaborations={() => setIsSideBarOpen(true)}
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
