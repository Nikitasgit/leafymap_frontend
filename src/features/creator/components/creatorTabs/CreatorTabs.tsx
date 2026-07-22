import { useState } from "react";
import { useTranslation } from "react-i18next";
import TabsContainer from "@/shared/ui/tabs/tabsContainer";
import Tab from "@/shared/ui/tabs/tab";
import { FileText, Star, Image as ImageIcon, Calendar } from "lucide-react";
import { Place, PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";
import { useUserEvents } from "@/features/events/hooks/useUserEvents";
import { ACTIVE_LIFECYCLE_STATUSES } from "@/features/events/utils/constants";
import PresentationTab from "../presentationTab";
import EventsTab from "@/features/events/components/eventsTab";
import ReviewsTab from "@/features/reviews/components/reviewsTab";
import GallerySection from "@/features/users/components/gallerySection";
import styles from "./CreatorTabs.module.scss";

export interface CreatorTabsProps {
  user: UserPopulated;
  place: Place | null;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onMapButtonClick?: (placeItem: {
    location: { coordinates: number[] } | null;
    id: string;
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
  const { t } = useTranslation("profile");
  const [internalActiveTab, setInternalActiveTab] = useState("presentation");
  const { events, isLoading: isLoadingEvents } = useUserEvents(
    user.id || null,
    ACTIVE_LIFECYCLE_STATUSES,
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = onTabChange ?? setInternalActiveTab;

  const shouldShowEventsTab = !isLoadingEvents && events.length > 0;

  const tabs = [
    {
      id: "presentation",
      label: t("creatorTabs.presentation"),
      icon: FileText,
    },
    ...(place
      ? [{ id: "reviews", label: t("creatorTabs.reviews"), icon: Star }]
      : []),
    ...(shouldShowEventsTab
      ? [{ id: "events", label: t("creatorTabs.events"), icon: Calendar }]
      : []),
    { id: "images", label: t("creatorTabs.images"), icon: ImageIcon },
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
        return place?.id ? (
          <ReviewsTab
            reference={place.id}
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
            reference={user.id || null}
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
