import { useState, useEffect } from "react";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { FileText, Star, Image as ImageIcon, Calendar } from "lucide-react";
import { Place } from "@/types/place";
import { useAuth } from "@/hooks/useAuth";
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

  useEffect(() => {
    if (!place && (activeTab === "reviews" || activeTab === "events")) {
      setActiveTab("presentation");
    }
  }, [place, activeTab]);

  // Check if current user is the owner of the place
  const isOwner = (() => {
    if (!currentUser || !place) return false;
    return currentUser._id === user._id;
  })();

  const tabs = [
    { id: "presentation", label: "Présentation", icon: FileText },
    ...(place
      ? [
          { id: "reviews", label: "Avis", icon: Star },
          { id: "events", label: "Événements", icon: Calendar },
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
