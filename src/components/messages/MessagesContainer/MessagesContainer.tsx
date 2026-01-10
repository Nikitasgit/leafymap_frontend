"use client";

import { useState } from "react";
import { Handshake, Mail, Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import MessagesTab from "@/components/messages/MessagesTab";
import EventInvitationsTab from "@/components/messages/EventInvitationsTab";
import PartnershipsTab from "@/components/messages/PartnershipsTab";
import styles from "./MessagesContainer.module.scss";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";

type TabType = "messages" | "event-invitations" | "partnerships";

export default function MessagesContainer() {
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  const handleTabClick = (id: string) => {
    setActiveTab(id as TabType);
  };

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
      <TabsContainer>
        <Tab
          id="messages"
          label="Messages"
          icon={Mail}
          isActive={activeTab === "messages"}
          onClick={handleTabClick}
        />
        {user.userType === "creator" && (
          <>
            <Tab
              id="event-invitations"
              label="Invitations événements"
              icon={Calendar}
              isActive={activeTab === "event-invitations"}
              onClick={handleTabClick}
            />
            <Tab
              id="partnerships"
              label="Partenariats"
              icon={Handshake}
              isActive={activeTab === "partnerships"}
              onClick={handleTabClick}
            />
          </>
        )}
      </TabsContainer>

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
