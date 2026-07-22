"use client";

import { UserPopulated } from "@/features/users/types";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/features/auth";
import useFollowers from "../../hooks/useFollowers";
import UserCard from "@/features/users/components/userCard";
import EmptyState from "@/shared/ui/noResults/emptyState";
import { Users } from "lucide-react";
import styles from "./FollowersTab.module.scss";
import LoadingBar from "@/shared/ui/loading/loadingBar";

const FollowersTab: React.FC = () => {
  const { t } = useTranslation("account");
  const { user } = useCurrentUser();
  const { followers, isLoading } = useFollowers(user?.id);

  if (isLoading) {
    return <LoadingBar />;
  }

  return (
    <div className={styles.followersTab}>
      {followers.length > 0 ? (
        <div className={styles.followersList}>
          {followers.map((follower) => {
            const userPopulated = {
              id: follower.id,
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
            return (
              <UserCard
                key={follower.id}
                user={userPopulated as UserPopulated}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={t("followersTab.emptyTitle")}
          icon={<Users className={styles.icon} />}
        />
      )}
    </div>
  );
};

export default FollowersTab;
