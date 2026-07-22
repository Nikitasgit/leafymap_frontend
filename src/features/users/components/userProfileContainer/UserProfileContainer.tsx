"use client";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import { useUser } from "../../hooks/useUser";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import styles from "./UserProfileContainer.module.scss";
import { useAuth } from "@/features/auth";
import useSubmitImages from "@/shared/hooks/useSubmitImages";
import CreatorHeader from "@/features/creator/components/creatorHeader";
import CreatorTabs from "@/features/creator/components/creatorTabs";
import { usePlace } from "@/features/places";
import { resolveRefId } from "@/shared/api/normalizers/resolveRef";

const UserProfileContainer = () => {
  const { userId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();
  const { user, isLoading: isLoadingUser, refetch: refetchUser } = useUser(
    userId as string,
  );
  const { submitImages, isLoading: isUploadingImages } = useSubmitImages();
  const placeId = useMemo(
    () => resolveRefId(user?.place),
    [user?.place],
  );

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
        reference: user.id,
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
    currentUser?.id && user?.id && currentUser.id === user.id,
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
