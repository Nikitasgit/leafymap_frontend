"use client";

import AccountPlacesList from "@/components/account/AccountPlacesList/AccountPlacesList";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AccountHeader from "@/components/account/AccountHeader";
import AccountActions from "@/components/account/AccountActions";
import styles from "./AccountContainer.module.scss";

export default function AccountContainer() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  if (isLoadingUser || !user) return <LoadingBar />;

  return (
    <div className={styles.accountContainer}>
      <AccountHeader user={user} isLoadingUser={isLoadingUser} />
      <AccountActions user={user} isLoadingUser={isLoadingUser} />
      {user?.places && user.places.length > 0 && (
        <AccountPlacesList places={user?.places} />
      )}
    </div>
  );
}
