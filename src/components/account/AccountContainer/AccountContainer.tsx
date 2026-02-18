"use client";

import AccountPlaceCard from "@/components/account/AccountPlaceCard/AccountPlaceCard";
import AccountHeader from "@/components/account/AccountHeader";
import AccountActions from "@/components/account/AccountActions";
import TitleWithLine from "@/components/common/typography/TitleWithLine";
import { SideBar } from "@/components/common/SideBar";
import styles from "./AccountContainer.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAccountSidebar } from "@/hooks/useAccountSidebar";

export default function AccountContainer() {
  const { user, isLoading: isLoadingUser, refetch: refetchUser } =
    useCurrentUser();
  const sidebar = useAccountSidebar(user);

  if (isLoadingUser) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.accountLayout}>
      <SideBar
        title={sidebar.title}
        isOpen={sidebar.isSideBarOpen}
        onClose={sidebar.onClose}
        initialTabId={sidebar.initialTabId}
        onTabChange={sidebar.onTabChange}
        tabs={sidebar.tabs}
      />
      <div className={styles.accountContainer}>
        <AccountHeader
          user={user!}
          isLoadingUser={isLoadingUser}
          onUserUpdated={refetchUser}
        />
        <AccountActions
          user={user!}
          isLoadingUser={isLoadingUser}
          onOpenCollaborations={sidebar.onOpenCollaborations}
          onOpenEvents={sidebar.onOpenEvents}
          onOpenReviews={sidebar.onOpenReviews}
          onOpenFollows={sidebar.onOpenFollows}
          onOpenProducts={sidebar.onOpenProducts}
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
