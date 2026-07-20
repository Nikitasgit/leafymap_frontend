"use client";

import { UserPopulated } from "@/types/user";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useFollowers from "@/hooks/useFollowers";
import { UserCard } from "@/components/userProfile/PlacesSection/UserCard";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Users } from "lucide-react";
import styles from "./FollowersTab.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";

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
