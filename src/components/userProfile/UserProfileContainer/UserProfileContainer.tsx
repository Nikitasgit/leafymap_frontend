"use client";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useUser } from "@/hooks/useUser";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./UserProfileContainer.module.scss";
import { useAuth } from "@/hooks/useAuth";
import useSubmitImages from "@/hooks/useSubmitImages";
import MapCreatorCardHeader from "@/components/map/MapCreatorCardHeader";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { FileText, Star, Image as ImageIcon, Calendar } from "lucide-react";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";
import PresentationTab from "@/components/map/PresentationTab";
import EventsTab from "@/components/common/events/EventsTab";
import { usePlace } from "@/hooks/usePlace";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";

const UserProfileContainer = () => {
  const { userId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("presentation");
  const { user: currentUser } = useAuth();
  const { user, isLoading: isLoadingUser } = useUser(userId as string);
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

  const { events, isLoading: isLoadingEvents } = usePlaceEvents(
    place?._id || null
  );

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

  useEffect(() => {
    if (!place && (activeTab === "reviews" || activeTab === "events")) {
      setActiveTab("presentation");
    }
    if (
      activeTab === "events" &&
      !isLoadingEvents &&
      events.length === 0 &&
      place
    ) {
      setActiveTab("presentation");
    }
  }, [place, activeTab, events.length, isLoadingEvents]);

  // Initialize tab from URL on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const availableTabs = ["presentation", "images"];
    if (place) {
      availableTabs.push("reviews");
      if (!isLoadingEvents && events.length > 0) {
        availableTabs.push("events");
      }
    }
    if (tabFromUrl && availableTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl && !availableTabs.includes(tabFromUrl)) {
      // If user tries to access a tab that's not available, redirect to presentation
      setActiveTab("presentation");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("tab", "presentation");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, place, events.length, isLoadingEvents, router]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabId);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const isOwner = (() => {
    if (!currentUser || !place) return false;
    return currentUser._id === user?._id;
  })();

  const shouldShowEventsTab = place && !isLoadingEvents && events.length > 0;

  const tabs = [
    { id: "presentation", label: "Présentation", icon: FileText },
    ...(place
      ? [
          { id: "reviews", label: "Avis", icon: Star },
          ...(shouldShowEventsTab
            ? [{ id: "events", label: "Événements", icon: Calendar }]
            : []),
        ]
      : []),
    { id: "images", label: "Images", icon: ImageIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "presentation":
        return (
          <PresentationTab
            place={place || null}
            user={user!}
            onMapButtonClick={async () => {
              // No-op for user profile page
            }}
          />
        );
      case "events":
        return place?._id && user?.username ? (
          <EventsTab placeId={place._id} username={user.username} />
        ) : null;
      case "reviews":
        return place?._id ? (
          <ReviewsTab
            reference={place._id}
            referenceType="Place"
            canReview={!isOwner}
            canReply={isOwner}
            onRatingUpdated={refetchPlace}
          />
        ) : null;
      case "images":
        return (
          <GallerySection
            reference={user?._id || null}
            referenceType="User"
            isOwner={isOwner}
            isUploading={isUploadingImages}
            onFilesSelected={handleFilesSelected}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) return <LoadingBar />;

  if (!user) return <LoadingBar />;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.headerSpacing}>
          <MapCreatorCardHeader
            place={place || null}
            user={user}
            isLoading={isLoading}
            variant="full"
          />
        </div>
        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={handleTabClick}
            />
          ))}
        </TabsContainer>
        <div className={styles.tabContent}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserProfileContainer;
