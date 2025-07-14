"use client";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlace } from "@/hooks/usePlace";
import { useParams } from "next/navigation";
import React from "react";

const PlacePage = () => {
  const { placeId } = useParams();
  const { place, loading } = usePlace(placeId as string);
  const { user, isLoading: userLoading } = useCurrentUser();
  const isCurrentUserPlace = user?.places?.some(
    (place) => place._id === placeId
  );

  if (loading || userLoading) return <LoadingBar />;
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Place Profile Picture</h1>
      <div style={{ marginBottom: "2rem" }}>
        <h3>Small Size Example</h3>
        <ProfilePictureUploader
          entityType="place"
          entityId={placeId as string}
          initialImage={place?.image}
          size="medium"
          disabled={!isCurrentUserPlace}
          isOwner={isCurrentUserPlace}
        />
      </div>
    </div>
  );
};

export default PlacePage;
