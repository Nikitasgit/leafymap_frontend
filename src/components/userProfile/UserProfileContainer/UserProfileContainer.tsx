"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useUser } from "@/hooks/useUser";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import styles from "./UserProfileContainer.module.scss";
import { useAuth } from "@/hooks/useAuth";
import useSubmitImages from "@/hooks/useSubmitImages";
import CreatorHeader from "@/components/creator/creatorHeader";
import CreatorTabs from "@/components/creator/creatorTabs";
import { usePlace } from "@/hooks/usePlace";

const UserProfileContainer = () => {
  const { userId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  const { user, isLoading: isLoadingUser, refetch: refetchUser } = useUser(
    userId as string,
  );
  const { submitImages, isLoading: isUploadingImages } = useSubmitImages();
  const placeId = useMemo(() => {
    if (!user?.place) return null;
    return typeof user.place === "string" ? user.place : user.place._id;
  }, [user?.place]);

  const {
    place,
    isLoading: isLoadingPlace,
    refetch: refetchPlace,
  } = usePlace(placeId, {
    scheduleWithEvents: true,
  });

  const isLoading = isLoadingUser || isLoadingPlace;

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    if (!user) {
      console.error("User not found");
      return;
    }
    try {
      await submitImages({
        files,
        reference: user._id,
        referenceType: "User",
        type: "gallery",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const tabFromUrl = searchParams.get("tab");
  const availableTabs = ["presentation", "images"];
  if (place) {
    availableTabs.push("reviews", "events");
  }

  // L'URL est la source de vérité : l'onglet actif en est dérivé.
  const activeTab =
    tabFromUrl && availableTabs.includes(tabFromUrl)
      ? tabFromUrl
      : "presentation";

  const hasInvalidTabInUrl = Boolean(
    tabFromUrl && !availableTabs.includes(tabFromUrl) && !isLoadingPlace,
  );

  useEffect(() => {
    if (!hasInvalidTabInUrl) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", "presentation");
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  }, [hasInvalidTabInUrl, searchParams, router]);

  const handleTabClick = (tabId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabId);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const isOwner = Boolean(
    currentUser?._id && user?._id && currentUser._id === user._id,
  );

  if (isLoading) return <LoadingBar />;

  if (!user) return <LoadingBar />;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.headerSpacing}>
          <CreatorHeader
            place={place || null}
            user={user}
            isLoading={isLoading}
            variant="full"
          />
        </div>
        <CreatorTabs
          user={user}
          place={place || null}
          activeTab={activeTab}
          onTabChange={handleTabClick}
          onPlaceRefetch={refetchPlace}
          refetchUser={refetchUser}
          isOwner={isOwner}
          isUploadingImages={isUploadingImages}
          onFilesSelected={handleFilesSelected}
        />
      </div>
    </div>
  );
};

export default UserProfileContainer;
