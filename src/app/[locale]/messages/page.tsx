"use client";

import React, { useState } from "react";
import Text from "@/components/common/typography/Text";
import { MessageSquare, Handshake, Mail } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import PartnershipMessage from "@/components/messages/PartnershipMessage";
import LoadingBar from "@/components/common/loading/LoadingBar";
import styles from "./page.module.scss";
import { useSubmitPartnerships } from "@/hooks/useSubmitPartnerships";
import { PartnershipPopulated } from "@/types/partnerships";

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

  if (isLoadingUser || !user) {
    return <LoadingBar />;
  }
  const renderTabContent = () => {
    if (activeTab === "messages") {
      return (
        <div className={styles.emptyState}>
          <Mail size={64} className={styles.emptyIcon} />
          <Text as="h2" className={styles.emptyTitle}>
            No Messages Yet
          </Text>
          <Text as="p" className={styles.emptyDescription}>
            Your direct messages will appear here. This feature is coming soon!
          </Text>
        </div>
      );
    }

    if (activeTab === "invitations") {
      const pendingPartnerships = partnerships.filter(
        (p) => p.status === "pending" && !p.deleted
      );
      const acceptedPartnerships = partnerships.filter(
        (p) => p.status === "accepted" && !p.deleted
      );
      const refusedPartnerships = partnerships.filter(
        (p) => p.status === "refused" && !p.deleted
      );

      if (isLoadingPartnerships) {
        return <LoadingBar />;
      }

      return (
        <div className={styles.content}>
          {pendingPartnerships.length > 0 && (
            <section className={styles.section}>
              <Text as="h2" className={styles.sectionTitle}>
                Pending Partnerships ({pendingPartnerships.length})
              </Text>
              <div className={styles.partnershipsList}>
                {pendingPartnerships.map((partnership) => (
                  <PartnershipMessage
                    key={partnership._id}
                    partnership={partnership as PartnershipPopulated}
                    currentUser={user}
                    onStatusChange={submitPartnerships}
                    isLoading={false}
                  />
                ))}
              </div>
            </section>
          )}

          {acceptedPartnerships.length > 0 && (
            <section className={styles.section}>
              <Text as="h2" className={styles.sectionTitle}>
                Accepted Partnerships ({acceptedPartnerships.length})
              </Text>
              <div className={styles.partnershipsList}>
                {acceptedPartnerships.map((partnership) => (
                  <PartnershipMessage
                    key={partnership._id}
                    partnership={partnership as PartnershipPopulated}
                    currentUser={user}
                    onStatusChange={submitPartnerships}
                    isLoading={false}
                  />
                ))}
              </div>
            </section>
          )}

          {refusedPartnerships.length > 0 && (
            <section className={styles.section}>
              <Text as="h2" className={styles.sectionTitle}>
                Refused Partnerships ({refusedPartnerships.length})
              </Text>
              <div className={styles.partnershipsList}>
                {refusedPartnerships.map((partnership) => (
                  <PartnershipMessage
                    key={partnership._id}
                    partnership={partnership as PartnershipPopulated}
                    currentUser={user}
                    onStatusChange={submitPartnerships}
                    isLoading={false}
                  />
                ))}
              </div>
            </section>
          )}

          {partnerships.length === 0 && (
            <div className={styles.emptyState}>
              <Handshake size={64} className={styles.emptyIcon} />
              <Text as="h2" className={styles.emptyTitle}>
                No Partnership Invitations
              </Text>
              <Text as="p" className={styles.emptyDescription}>
                You don&apos;t have any partnership invitations yet. When
                organizers send you partnership requests, they will appear here.
              </Text>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <MessageSquare size={32} className={styles.icon} />
        <Text as="h1" className={styles.title}>
          Messages
        </Text>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "messages" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("messages")}
        >
          <Mail size={20} />
          Messages
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "invitations" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("invitations")}
        >
          <Handshake size={20} />
          Invitations
        </button>
      </div>

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </main>
  );
}
