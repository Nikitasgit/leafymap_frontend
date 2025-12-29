"use client";

import AccountPlaceCard from "@/components/account/AccountPlaceCard/AccountPlaceCard";
import AccountHeader from "@/components/account/AccountHeader";
import AccountActions from "@/components/account/AccountActions";
import TitleWithLine from "@/components/common/typography/TitleWithLine";
import styles from "./AccountContainer.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function AccountContainer() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  if (isLoadingUser) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.accountContainer}>
      <AccountHeader user={user!} isLoadingUser={isLoadingUser} />
      <AccountActions user={user!} isLoadingUser={isLoadingUser} />
      {user?.place && typeof user.place === "object" && (
        <div>
          <TitleWithLine>Votre lieu</TitleWithLine>
          <AccountPlaceCard place={user.place} />
        </div>
      )}
    </div>
  );
}
