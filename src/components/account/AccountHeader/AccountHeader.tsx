"use client";
import React from "react";
import { Image } from "@/types/image";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploader";
import { capitalizeFirstLetter } from "@/utils/functions";
import styles from "./AccountHeader.module.scss";
import useSubmitUser from "@/hooks/useSubmitUser";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";

interface AccountHeaderProps {
  user: {
    _id: string;
    username?: string;
    email: string;
    image?: string | Image;
    userCategory?: { name: string };
    googlePictureUrl?: string;
  };
  isLoadingUser: boolean;
  onUserUpdated?: () => void | Promise<void>;
}

export default function AccountHeader({
  user,
  isLoadingUser,
  onUserUpdated,
}: AccountHeaderProps) {
  const { submitUser } = useSubmitUser();
  const displayName =
    user.username?.trim() ||
    user.email.split("@")[0] ||
    "Mon compte";
  const handleImageUploaded = async (
    imageId: string | null,
    googlePictureUrl?: string | null,
  ) => {
    if (imageId) {
      await submitUser({
        image: imageId,
      });
    }
    if (googlePictureUrl) {
      await submitUser({
        googlePictureUrl: "",
      });
    }
    await onUserUpdated?.();
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.usernameRow}>
          <h1 className={styles.username}>
            {capitalizeFirstLetter(displayName)}
          </h1>
        </div>
        {user.userCategory && (
          <div className={styles.creatorInfoContainer}>
            <CreatorCategoryBadge categoryName={user.userCategory.name} />
          </div>
        )}
        <p className={styles.email}>{user.email}</p>
      </div>
      <ProfilePictureUploader
        googlePictureUrl={user.googlePictureUrl}
        onImageUploaded={handleImageUploaded}
        type="User"
        reference={user._id}
        initialImage={user.image as Image}
        isOwner={true}
        rounded
        disabled={isLoadingUser}
      />
    </header>
  );
}
