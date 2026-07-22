"use client";

import AccountHeader from "../accountHeader";
import AccountActions from "../accountActions";
import { SideBar } from "@/shared/ui/sideBar";
import styles from "./AccountContainer.module.scss";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useCurrentUser } from "@/features/auth";
import { useAccountSidebar } from "../../hooks/useAccountSidebar";

export default function AccountContainer() {
  const { user, isLoading: isLoadingUser, refetch: refetchUser } =
    useCurrentUser();
  const sidebar = useAccountSidebar(user);

  if (isLoadingUser || !user) {
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
          user={user}
          isLoadingUser={isLoadingUser}
          onUserUpdated={refetchUser}
        />
        <AccountActions
          user={user}
          isLoadingUser={isLoadingUser}
          onToggleSidebar={sidebar.toggleSidebar}
        />
      </div>
    </div>
  );
}
