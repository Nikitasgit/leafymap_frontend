"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import styles from "./UserProfileContainer.module.scss";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import { useAuth } from "@/hooks/useAuth";
import useSubmitImages from "@/hooks/useSubmitImages";
import UserHeader from "@/components/userProfile/UserHeader/UserHeader";
import { PlacesSectionContainer } from "@/components/userProfile/PlacesSection/PlacesSectionContainer";
import EventsSectionContainer from "@/components/userProfile/EventsSection/EventsSectionContainer";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";
import { User as UserIcon, MapPin, Calendar } from "lucide-react";

const UserProfileContainer = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("gallery");
  const { user: currentUser } = useAuth();
  const { user, isLoading } = useUser(userId as string);
  const {
    images,
    isLoading: isLoadingImages,
    refetch: refetchImages,
  } = useGalleryImages(userId as string, "User");
  const { partnerships, isLoading: isLoadingPartnerships } =
    usePartnershipByUserId(userId as string, {
      asCollaborator: "true",
      onlyAccepted: "true",
    });
  const { submitImages, isLoading: isUploadingImages } = useSubmitImages();
  const placePartnerships = partnerships.filter(
    (partnership) => partnership.type === "place"
  );
  const eventPartnerships = partnerships.filter(
    (partnership) => partnership.type === "event"
  );

  const handleFollow = () => {
    // TODO: Implement follow functionality
    console.log("Follow user");
  };

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
    { id: "gallery", label: "Galerie", icon: UserIcon },
    { id: "places", label: "Lieux partenaires", icon: MapPin },
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
      case "places":
        return (
          <PlacesSectionContainer
            placePartnerships={placePartnerships}
            user={user!}
          />
        );
      case "events":
        return (
          <EventsSectionContainer
            eventPartnerships={eventPartnerships}
            user={user!}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading || isLoadingPartnerships) return <LoadingBar />;

  const isOwner = currentUser && user && currentUser._id === user._id;

  if (!user) return <LoadingBar />;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <UserHeader user={user} onFollow={handleFollow} />
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

export default UserProfileContainer;
