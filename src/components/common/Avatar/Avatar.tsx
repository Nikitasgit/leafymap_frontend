import React from "react";
import Image from "next/image";
import { getDisplayName, getAvatarLetter } from "@/utils/userDisplay";
import type { AvatarProps } from "./Avatar.types";
import styles from "./Avatar.module.scss";

const Avatar: React.FC<AvatarProps> = ({ user, size = 32, className }) => {
  const displayName = getDisplayName(user);
  const avatarLetter = getAvatarLetter(user);
  const imageUrl = user?.image?.urls?.thumbnail;

  return (
    <div
      className={`${styles.avatarWrapper} ${className ?? ""}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={displayName}
          width={size}
          height={size}
          className={styles.avatar}
        />
      ) : (
        <div
          className={styles.avatarPlaceholder}
          style={{ fontSize: size * 0.4375 }}
        >
          {avatarLetter}
        </div>
      )}
    </div>
  );
};

export default Avatar;
