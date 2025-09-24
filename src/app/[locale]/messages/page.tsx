"use client";

import React, { useEffect, useState } from "react";
import { Handshake, Mail } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./page.module.scss";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { Tab, TabsContainer } from "@/components/common/tabs";
import MessagesTab from "@/components/messages/MessagesTab";
import InvitationsTab from "@/components/messages/InvitationsTab";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";

type TabType = "messages" | "invitations";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const {
    partnerships,
    isLoading: isLoadingPartnerships,
    refetch,
  } = usePartnershipByUserId(user?._id, {
    asCollaborator: "true",
    includeCancelledEvents: "false",
    includePastEvents: "false",
  });
  const { submitPartnerships } = useSubmitPartnerships(refetch);

  const handleTabClick = (id: string) => {
    setActiveTab(id as TabType);
  };

  const renderTabContent = () => {
    if (activeTab === "messages") {
      return <MessagesTab />;
    }
    if (activeTab === "invitations") {
      return (
        <InvitationsTab
          partnerships={partnerships as PartnershipPopulated[]}
          currentUser={user as UserPopulated}
          isLoading={isLoadingPartnerships}
          onStatusChange={submitPartnerships}
        />
      );
    }
  };

  useEffect(() => {
    if (user && user.userType === "creator") {
      setActiveTab("invitations");
    }
  }, [user]);

  if (isLoadingUser || !user) {
    return <LoadingBar />;
  }
  return (
    <main className={styles.container}>
      <TabsContainer>
        {user.userType === "creator" && (
          <Tab
            id="invitations"
            label="Invitations"
            icon={Handshake}
            isActive={activeTab === "invitations"}
            onClick={handleTabClick}
          />
        )}
        <Tab
          id="messages"
          label="Messages"
          icon={Mail}
          isActive={activeTab === "messages"}
          onClick={handleTabClick}
        />
      </TabsContainer>

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </main>
  );
}
