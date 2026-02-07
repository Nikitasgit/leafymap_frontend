"use client";

import React from "react";
import { Handshake } from "lucide-react";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import styles from "./PartnershipsTab.module.scss";
import EmptyState from "@/components/common/noResults/EmptyState";

export default function PartnershipsTab() {
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  if (isLoadingUser) {
    return <LoadingBar />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.content}>
      <EmptyState
        title="Aucun partenariat"
        description="Vous n'avez pas de partenariats. Lorsque quelqu'un vous propose un partenariat, il apparaîtra ici."
        icon={<Handshake size={64} />}
      />
    </div>
  );
}
