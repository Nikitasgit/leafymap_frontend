"use client";

import { useState } from "react";
import { Handshake, Mail } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import MessagesTab from "@/components/messages/MessagesTab";
import InvitationsTab from "@/components/messages/InvitationsTab";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import styles from "./MessagesContainer.module.scss";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";

type TabType = "messages" | "invitations";

export default function MessagesContainer() {
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

  const pendingPartnerships = partnerships.filter(
    (p) => p.status === "pending" && !p.deleted
  );

  const renderTabContent = () => {
    if (activeTab === "messages") {
      return <MessagesTab />;
    }
    if (activeTab === "invitations") {
      return (
        <InvitationsTab
          pendingPartnerships={pendingPartnerships}
          partnerships={partnerships as PartnershipPopulated[]}
          currentUser={user as UserPopulated}
          isLoading={isLoadingPartnerships}
          onStatusChange={submitPartnerships}
        />
      );
    }
  };

  if (isLoadingUser || !user) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.container}>
      <TabsContainer>
        <Tab
          id="messages"
          label="Messages"
          icon={Mail}
          isActive={activeTab === "messages"}
          onClick={handleTabClick}
        />
        {user.userType === "creator" && (
          <Tab
            id="invitations"
            label="Invitations"
            icon={Handshake}
            isActive={activeTab === "invitations"}
            onClick={handleTabClick}
            badge={pendingPartnerships.length}
          />
        )}
      </TabsContainer>

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
