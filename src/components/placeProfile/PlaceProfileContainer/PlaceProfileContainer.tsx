"use client";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { usePlace } from "@/hooks/usePlace";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import { useImages } from "@/hooks/useImages";
import { useAuth } from "@/hooks/useAuth";
import useSubmitImages from "@/hooks/useSubmitImages";
import React, { useState, useEffect } from "react";
import styles from "./PlaceProfileContainer.module.scss";
import PlaceHeader from "@/components/placeProfile/PlaceHeader/PlaceHeader";
import PlaceEventsSection from "@/components/placeProfile/PlaceEventsSection/PlaceEventsSection";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { Image as ImageIcon, Calendar, Users, Star } from "lucide-react";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import PartnershipsSection from "@/components/placeProfile/PartnershipsSection/PartnershipsSection";
import { PartnershipPopulated } from "@/types/partnerships";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";

const PlaceProfileContainer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("gallery");
  const placeId = params.placeId as string;
  const { user: currentUser } = useAuth();
  const {
    place,
    isLoading: placeLoading,
    refetch: refetchPlace,
  } = usePlace(placeId);
  const { events, isLoading: eventsLoading } = usePlaceEvents(placeId);
  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    placeId,
    undefined,
    "place",
    true
  );
  const {
    images,
    isLoading: isLoadingImages,
    refetch: refetchImages,
  } = useImages(placeId, "Place", "gallery");
  const { submitImages, isLoading: isUploadingImages } = useSubmitImages();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    if (!place) {
      console.error("Place not found");
      return;
    }
    try {
      await submitImages({
        files,
        reference: place._id,
        referenceType: "Place",
        type: "gallery",
      });
      await refetchImages();
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleImageDeleted = async () => {
    await refetchImages();
  };

  // Initialize tab from URL on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const tabs = ["gallery", "partnerships", "events", "reviews"];
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabId);
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const tabs = [
    { id: "gallery", label: "Galerie", icon: ImageIcon },
    { id: "partnerships", label: "Partenaires", icon: Users },
    { id: "events", label: "Événements", icon: Calendar },
    { id: "reviews", label: "Avis", icon: Star },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "gallery":
        return (
          <GallerySection
            images={images || []}
            isLoading={isLoadingImages || isUploadingImages}
            isOwner={isOwner || false}
            onFilesSelected={handleFilesSelected}
            onImageDeleted={handleImageDeleted}
          />
        );
      case "partnerships":
        return (
          <PartnershipsSection
            partnerships={partnerships as PartnershipPopulated[]}
          />
        );
      case "events":
        return <PlaceEventsSection events={events || []} />;
      case "reviews":
        return (
          <ReviewsTab
            reference={place?._id || ""}
            referenceType="Place"
            canReview={!isOwner}
            canReply={isOwner || false}
            onRatingUpdated={refetchPlace}
          />
        );
      default:
        return null;
    }
  };

  if (placeLoading || eventsLoading || partnershipsLoading)
    return <LoadingBar />;

  const isOwner =
    currentUser &&
    place &&
    typeof place.user === "object" &&
    currentUser._id === place.user._id;

  if (!place) return <LoadingBar />;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <PlaceHeader place={place} />
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
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PlaceProfileContainer;
