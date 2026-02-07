import { useState, useEffect } from "react";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { FileText, Star, Image as ImageIcon, Calendar } from "lucide-react";
import { Place, PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import { ACTIVE_LIFECYCLE_STATUSES } from "@/utils/constants";
import PresentationTab from "@/components/creator/PresentationTab";
import EventsTab from "@/components/common/events/EventsTab";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import styles from "./CreatorTabs.module.scss";

export interface CreatorTabsProps {
  user: UserPopulated;
  place: Place | null;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onMapButtonClick?: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
  onPlaceRefetch?: () => void;
  isOwner?: boolean;
  isUploadingImages?: boolean;
  isPlaceLoading?: boolean;
  onFilesSelected?: (files: File[]) => void;
  canHandleImages?: boolean;
}

const CreatorTabs = ({
  user,
  place,
  activeTab: controlledActiveTab,
  onTabChange,
  onMapButtonClick,
  onPlaceRefetch,
  isOwner = false,
  isUploadingImages = false,
  onFilesSelected,
  isPlaceLoading = false,
  canHandleImages = false,
}: CreatorTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState("presentation");
  const { events, isLoading: isLoadingEvents } = usePlaceEvents(
    place?._id || null,
    ACTIVE_LIFECYCLE_STATUSES
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = onTabChange ?? setInternalActiveTab;
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
  }, [place, activeTab, events.length, isLoadingEvents, setActiveTab]);

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
            place={place}
            isPlaceLoading={isPlaceLoading}
            user={user}
            onMapButtonClick={onMapButtonClick || (async () => {})}
          />
        );
      case "events":
        return place?._id && user.username ? (
          <EventsTab
            username={user.username}
            place={place as PlacePopulated}
            user={user}
            events={events}
          />
        ) : null;
      case "reviews":
        return place?._id ? (
          <ReviewsTab
            reference={place._id}
            referenceType="Place"
            isOwner={isOwner}
            canReview={!isOwner}
            canReply={isOwner}
            onRatingUpdated={onPlaceRefetch}
          />
        ) : null;
      case "images":
        return (
          <GallerySection
            reference={user._id || null}
            referenceType="User"
            canHandleImages={canHandleImages}
            isUploading={isUploadingImages}
            onFilesSelected={onFilesSelected}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </TabsContainer>
      <div className={styles.tabContent}>{renderTabContent()}</div>
    </>
  );
};

export default CreatorTabs;
