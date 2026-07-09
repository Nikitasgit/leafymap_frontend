import React from "react";
import { useTranslation } from "react-i18next";
import { UserCardProps } from "./UserCard.types";
import styles from "./UserCard.module.scss";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/common/Avatar";
import { getDisplayName } from "@/utils/userDisplay";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { t } = useTranslation("profile");
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
            <span className={styles.creatorBadge}>{t("userCard.creatorBadge")}</span>
          )}
        </div>
        <span className={styles.subtitle}>{t("userCard.visitProfile")}</span>
      </div>
    </a>
  );
};

export default UserCard;
