"use client";

import React from "react";
import { Mail } from "lucide-react";
import Text from "@/components/common/typography/Text";
import styles from "./MessagesTab.module.scss";

export default function MessagesTab() {
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
