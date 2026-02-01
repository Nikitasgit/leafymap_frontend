import React from "react";
import { GuestCardProps } from "./GuestCard.types";
import styles from "./GuestCard.module.scss";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/common/Avatar";
import { getDisplayName } from "@/utils/userDisplay";

const GuestCard: React.FC<GuestCardProps> = ({ user }) => {
  const router = useRouter();
  const displayName = getDisplayName(user);

  return (
    <a
      className={styles.guestCard}
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
        <h3 className={styles.displayName}>{displayName}</h3>
        <span className={styles.subtitle}>Visiter le profil</span>
      </div>
    </a>
  );
};

export default GuestCard;
