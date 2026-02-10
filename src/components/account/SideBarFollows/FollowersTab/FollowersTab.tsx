"use client";

import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useFollowers from "@/hooks/useFollowers";
import { UserCard } from "@/components/userProfile/PlacesSection/UserCard";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Users } from "lucide-react";
import styles from "./FollowersTab.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";

const FollowersTab: React.FC = () => {
  const { user } = useCurrentUser();
  const { followers, isLoading } = useFollowers(user?._id);

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.followersTab}>
      {followers.length > 0 ? (
        <div className={styles.followersList}>
          {followers.map((follower) => {
            const userPopulated = {
              _id: follower._id,
              username: follower.username || "",
              firstname: follower.firstname,
              lastname: follower.lastname,
              userType: follower.userType,
              image: follower.image,
              email: "",
              phone: "",
              website: "",
              description: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            return <UserCard key={follower._id} user={userPopulated as any} />;
          })}
        </div>
      ) : (
        <EmptyState
          title="Aucun abonné pour le moment"
          icon={<Users className={styles.icon} />}
        />
      )}
    </div>
  );
};

export default FollowersTab;
