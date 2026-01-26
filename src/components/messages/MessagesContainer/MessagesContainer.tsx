"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import MessagesTab from "@/components/messages/MessagesTab";
import EventInvitationsTab from "@/components/messages/EventInvitationsTab";
import PartnershipsTab from "@/components/messages/PartnershipsTab";
import styles from "./MessagesContainer.module.scss";

type TabType = "messages" | "event-invitations" | "partnerships";

export default function MessagesContainer() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(
    tabParam &&
      ["messages", "event-invitations", "partnerships"].includes(tabParam)
      ? tabParam
      : "messages"
  );
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  useEffect(() => {
    if (
      tabParam &&
      ["messages", "event-invitations", "partnerships"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("messages");
    }
  }, [tabParam]);

  const renderTabContent = () => {
    if (activeTab === "messages") {
      return <MessagesTab />;
    }
    if (activeTab === "event-invitations") {
      return <EventInvitationsTab />;
    }
    if (activeTab === "partnerships") {
      return <PartnershipsTab />;
    }
  };

  if (isLoadingUser || !user) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
