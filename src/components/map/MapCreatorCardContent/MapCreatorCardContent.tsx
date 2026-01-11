import { useState, useEffect } from "react";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { FileText, Star, Image as ImageIcon, Calendar } from "lucide-react";
import { Place } from "@/types/place";
import { useAuth } from "@/hooks/useAuth";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import PresentationTab from "../PresentationTab";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import EventsTab from "../../common/events/EventsTab";
import styles from "./MapCreatorCardContent.module.scss";
import { UserPopulated } from "@/types/user";

export interface MapCreatorCardContentProps {
  user: UserPopulated;
  place: Place | null;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
  onPlaceRefetch?: () => void;
}

const MapCreatorCardContent = ({
  user,
  place,
  onMapButtonClick,
  onPlaceRefetch,
}: MapCreatorCardContentProps) => {
  const [activeTab, setActiveTab] = useState("presentation");
  const { user: currentUser } = useAuth();
  const { events, isLoading: isLoadingEvents } = usePlaceEvents(
    place?._id || null
  );

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

  const isOwner = (() => {
    if (!currentUser || !place) return false;
    return currentUser._id === user._id;
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
            place={place}
            user={user}
            onMapButtonClick={onMapButtonClick}
          />
        );
      case "events":
        return place?._id && user.username ? (
          <EventsTab placeId={place._id} username={user.username} />
        ) : null;
      case "reviews":
        return place?._id ? (
          <ReviewsTab
            reference={place._id}
            referenceType="Place"
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
            isOwner={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.content}>
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
    </div>
  );
};

export default MapCreatorCardContent;
