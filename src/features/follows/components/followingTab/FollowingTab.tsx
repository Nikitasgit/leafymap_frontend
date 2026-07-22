"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/features/auth";
import useFollowingUsers from "../../hooks/useFollowingUsers";
import useFollow from "../../hooks/useFollow";
import PartnershipCard from "@/features/partnerships/components/partnershipCard";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import EmptyState from "@/shared/ui/noResults/emptyState";
import { Users } from "lucide-react";
import styles from "./FollowingTab.module.scss";
import type { FollowUser } from "../../types";

const FollowingTab: React.FC = () => {
  const { t } = useTranslation("account");
  const { user } = useCurrentUser();
  const { following, isLoading, refetch } = useFollowingUsers(user?.id);
  const { unfollow } = useFollow();

  const handleUnfollow = async (followId: string) => {
    try {
      await unfollow(followId);
      refetch();
    } catch {
      // Erreur gérée dans le hook
    }
  };

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.followingTab}>
      {following.length > 0 ? (
        <ul className={styles.items}>
          {following.map((user: FollowUser) => (
            <li key={user.id} className={styles.item}>
              <PartnershipCard
                user={{
                  id: user.id,
                  username: user.username,
                  image: user.image,
                  userCategory: undefined,
                }}
                showCategory={false}
                actions={
                  user.followId
                    ? [
                        {
                          label: t("followingTab.unfollow"),
                          onClick: () => handleUnfollow(user.followId!),
                        },
                      ]
                    : []
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={t("followingTab.emptyTitle")}
          icon={<Users className={styles.icon} />}
        />
      )}
    </div>
  );
};

export default FollowingTab;
