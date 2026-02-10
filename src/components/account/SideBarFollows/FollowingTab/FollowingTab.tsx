"use client";

import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useFollowingUsers from "@/hooks/useFollowingUsers";
import useFollow from "@/hooks/useFollow";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Users } from "lucide-react";
import styles from "./FollowingTab.module.scss";
import { FollowUser } from "@/types/follow";

const FollowingTab: React.FC = () => {
  const { user } = useCurrentUser();
  const { following, isLoading, refetch } = useFollowingUsers(user?._id);
  const { unfollow } = useFollow();

  const handleUnfollow = async (followId: string) => {
    try {
      await unfollow(followId);
      refetch();
    } catch (error) {
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
            <li key={user._id} className={styles.item}>
              <PartnershipCard
                user={{
                  _id: user._id,
                  username: user.username,
                  image: user.image,
                  userCategory: undefined,
                }}
                showCategory={false}
                actions={
                  user.followId
                    ? [
                        {
                          label: "Ne plus suivre",
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
          title="Aucun abonnement pour le moment"
          icon={<Users className={styles.icon} />}
        />
      )}
    </div>
  );
};

export default FollowingTab;
