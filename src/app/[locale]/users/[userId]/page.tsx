"use client";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUser } from "@/hooks/useUser";
import { Creator } from "@/types/user";
import { useParams } from "next/navigation";
import React from "react";

const UserPage = () => {
  const { userId } = useParams();
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();

  const { user, isLoading } = useUser(userId as string);
  const creatorUser = user as Creator;

  if (isLoading || userLoading) return <LoadingBar />;
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h3>Small Size Example</h3>
        <ProfilePictureUploader
          entityType="user"
          entityId={user?._id}
          initialImage={user?.image}
          size="medium"
          isOwner={currentUser?._id === user?._id}
        />
      </div>
      {creatorUser?.creatorProfile.place && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Place Picture </h3>
          <ProfilePictureUploader
            entityType="place"
            entityId={creatorUser?.creatorProfile.place._id}
            initialImage={creatorUser?.creatorProfile.place.image}
            size="medium"
            isOwner={currentUser?._id === user?._id}
          />
        </div>
      )}
    </div>
  );
};

export default UserPage;
