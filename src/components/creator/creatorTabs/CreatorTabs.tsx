import { useState } from "react";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { FileText, Star, Image as ImageIcon, Calendar } from "lucide-react";
import { Place, PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { useUserEvents } from "@/hooks/useUserEvents";
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
  refetchUser: () => void;
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
  refetchUser,
}: CreatorTabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState("presentation");
  const { events, isLoading: isLoadingEvents } = useUserEvents(
    user._id || null,
    ACTIVE_LIFECYCLE_STATUSES,
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = onTabChange ?? setInternalActiveTab;

  const shouldShowEventsTab = !isLoadingEvents && events.length > 0;

  const tabs = [
    { id: "presentation", label: "Présentation", icon: FileText },
    ...(place
      ? [
          { id: "reviews", label: "Avis", icon: Star },
        ]
      : []),
    ...(shouldShowEventsTab
      ? [{ id: "events", label: "Événements", icon: Calendar }]
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
            isOwner={isOwner}
            onMapButtonClick={onMapButtonClick || (async () => {})}
            refetchUser={refetchUser}
          />
        );
      case "events":
        return user.username ? (
          <EventsTab
            username={user.username}
            place={place ? (place as PlacePopulated) : undefined}
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
