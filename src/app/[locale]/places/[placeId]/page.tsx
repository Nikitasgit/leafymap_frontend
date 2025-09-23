"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePlace } from "@/hooks/usePlace";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import { useAuth } from "@/hooks/useAuth";
import useSubmitImages from "@/hooks/useSubmitImages";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import styles from "./placePage.module.scss";
import PlaceHeader from "@/components/placeProfile/PlaceHeader/PlaceHeader";
import PlaceEventsSection from "@/components/placeProfile/PlaceEventsSection/PlaceEventsSection";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";
import { Image as ImageIcon, Star, Calendar, Users } from "lucide-react";
import BackButton from "@/components/common/buttons/BackButton";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import PartnershipsSection from "@/components/placeProfile/PartnershipsSection/PartnershipsSection";
import { PartnershipPopulated } from "@/types/partnerships";
import EmptyState from "@/components/common/noResults/emptyState/EmptyState";

const PlacePage = () => {
  const { placeId } = useParams();
  const [activeTab, setActiveTab] = useState("gallery");

  const { user: currentUser } = useAuth();
  const { place, isLoading: placeLoading } = usePlace(placeId as string);
  const { events, isLoading: eventsLoading } = usePlaceEvents(
    placeId as string
  );
  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    placeId as string,
    undefined,
    "place"
  );
  const {
    images,
    isLoading: isLoadingImages,
    refetch: refetchImages,
  } = useGalleryImages(placeId as string, "Place");
  const { submitImages, isLoading: isUploadingImages } = useSubmitImages();

  const handleFollow = () => {
    // TODO: Implement follow functionality
    console.log("Follow place");
  };

  const handleMessage = () => {
    // TODO: Implement message functionality
    console.log("Message place");
  };

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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "gallery", label: "Galerie", icon: ImageIcon },
    { id: "reviews", label: "Avis", icon: Star },
    { id: "partnerships", label: "Createurs", icon: Users },
    { id: "events", label: "Événements", icon: Calendar },
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
      case "reviews":
        return (
          <EmptyState
            title="Aucun avis pour le moment"
            icon={<Star size={32} />}
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
    <main className={styles.pageContainer}>
      <BackButton />
      <PlaceHeader
        place={place}
        onFollow={handleFollow}
        onMessage={handleMessage}
      />

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
    </main>
  );
};

export default PlacePage;
