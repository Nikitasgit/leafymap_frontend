"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useUser } from "@/hooks/useUser";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./userPage.module.scss";
import { usePartnershipByUserId } from "@/hooks/usePartnershipByUserId";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import { useAuth } from "@/hooks/useAuth";
import useSubmitImages from "@/hooks/useSubmitImages";
import UserHeader from "@/components/userProfile/UserHeader/UserHeader";
import PlacesSection from "@/components/userProfile/PlacesSection/PlacesSection";
import EventsSection from "@/components/userProfile/EventsSection/EventsSection";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";
import { User as UserIcon, Star, MapPin, Calendar } from "lucide-react";

const UserPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("presentation");

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
  const place = user?.places?.[0];
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

  const handleMessage = () => {
    // TODO: Implement message functionality
    console.log("Message user");
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
    { id: "presentation", label: "Présentation", icon: UserIcon },
    { id: "avis", label: "Avis", icon: Star },
    { id: "lieux", label: "Lieux partenaires", icon: MapPin },
    { id: "evenements", label: "Événements", icon: Calendar },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "presentation":
        return (
          <GallerySection
            images={images || []}
            isLoading={isLoadingImages || isUploadingImages}
            isOwner={isOwner || false}
            onFilesSelected={handleFilesSelected}
            onImageDeleted={handleImageDeleted}
          />
        );
      case "avis":
        return (
          <div className={styles.emptyState}>
            <Star size={32} />
            <p>Aucun avis pour le moment</p>
          </div>
        );
      case "lieux":
        return (
          <PlacesSection placePartnerships={placePartnerships} user={user!} />
        );
      case "evenements":
        return (
          <EventsSection eventPartnerships={eventPartnerships} user={user!} />
        );
      default:
        return null;
    }
  };

  if (isLoading || isLoadingPartnerships) return <LoadingBar />;

  // Check if current user is the owner of this profile
  const isOwner = currentUser && user && currentUser._id === user._id;

  if (!user) return <LoadingBar />;

  return (
    <main className={styles.pageContainer}>
      <UserHeader
        user={user}
        place={place}
        onFollow={handleFollow}
        onMessage={handleMessage}
        onBack={() => router.back()}
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

export default UserPage;
