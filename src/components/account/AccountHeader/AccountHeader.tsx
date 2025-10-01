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
    username: string;
    email: string;
    creatorName?: string;
    image?: string | Image;
    creatorCategories?: Array<{ name: string }>;
  };
  isLoadingUser: boolean;
}

export default function AccountHeader({
  user,
  isLoadingUser,
}: AccountHeaderProps) {
  const { submitUser } = useSubmitUser();
  const handleImageUploaded = async (imageId: string | null) => {
    if (imageId) {
      await submitUser({
        image: imageId,
      });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <h1 className={styles.username}>
          {capitalizeFirstLetter(user.username)}
        </h1>
        {user.creatorName && (
          <div className={styles.creatorInfoContainer}>
            <p className={styles.creatorName}>
              {capitalizeFirstLetter(user.creatorName)}
            </p>
            <CreatorCategoryBadge
              categoryName={user.creatorCategories?.[0]?.name || ""}
            />
          </div>
        )}
        <p className={styles.email}>{user.email}</p>
      </div>
      <ProfilePictureUploader
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
