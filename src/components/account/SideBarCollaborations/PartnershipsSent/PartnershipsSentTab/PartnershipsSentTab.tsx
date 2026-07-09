"use client";

import React from "react";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "@/components/common/inputs/SearchInput";
import { useFindUsers } from "@/hooks/useFindUsers";
import { useAuth } from "@/hooks/useAuth";
import { useSendPartnership } from "@/hooks/useSendPartnership";
import { usePartnershipsSent } from "@/hooks/usePartnershipsSent";
import PartnershipsSentList from "../PartnershipsSentList";
import styles from "./PartnershipsSentTab.module.scss";
import { usePartnershipInvitationActions } from "@/hooks/usePartnershipInvitationActions";

export default function PartnershipsSentTab() {
  const { t } = useTranslation("account");
  const { searchUsers } = useFindUsers();
  const { user } = useAuth();
  const { partnerships, isLoading, refetch } = usePartnershipsSent(user?._id, {
    status: "pending",
  });
  const { sendPartnership } = useSendPartnership(refetch);
  const { cancelPartnershipInvitation, isLoading: isCancelling } =
    usePartnershipInvitationActions(refetch);
  const fetchSuggestions = async (query: string) => {
    const searchParams: Record<string, string | string[]> = {
      username: query,
    };
    if (user?._id) {
      searchParams.excludeIds = [user._id];
    }
    const users = await searchUsers(searchParams);
    return users.map((u) => ({
      _id: u._id,
      image: u.image?.urls?.thumbnail,
      name: u.username,
      categories: u.userCategory
        ? [
            {
              name: u.userCategory.name,
              type: u.userCategory.type,
            },
          ]
        : [],
    }));
  };

  const handleSelect = (suggestion: { _id: string }) => {
    sendPartnership(suggestion._id);
  };

  const handleCancel = (partnershipId: string) => {
    cancelPartnershipInvitation(partnershipId);
  };

  return (
    <div className={styles.partnershipsSentTab}>
      <div className={styles.searchContainer}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Users size={20} className={styles.icon} />
            {t("partnershipsSentTab.label")}
          </p>
          <p className={styles.info}>{t("partnershipsSentTab.info")}</p>
        </div>
        <div className={styles.searchInputContainer}>
          <SearchInput
            placeholder={t("partnershipsSentTab.searchPlaceholder")}
            onSelect={handleSelect}
            fetchSuggestions={fetchSuggestions}
            withIcons
          />
        </div>
      </div>
      <PartnershipsSentList
        partnerships={partnerships}
        isLoading={isLoading || isCancelling}
        onCancel={handleCancel}
      />
    </div>
  );
}
