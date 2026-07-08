import React from "react";
import { UserCardProps } from "./UserCard.types";
import styles from "./UserCard.module.scss";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/common/Avatar";
import { getDisplayName } from "@/utils/userDisplay";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter();
  const displayName = getDisplayName(user);
  const isCreator = user.userType === "creator";

  return (
    <a
      className={styles.userCard}
      onClick={() => {
        if (user) {
          router.push(`/users/${user._id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.avatarWrapper}>
        <Avatar user={user} size={48} />
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.nameRow}>
          <h3 className={styles.displayName}>{displayName}</h3>
          {isCreator && (
            <span className={styles.creatorBadge}>Créateur</span>
          )}
        </div>
        <span className={styles.subtitle}>Visiter le profil</span>
      </div>
    </a>
  );
};

export default UserCard;
