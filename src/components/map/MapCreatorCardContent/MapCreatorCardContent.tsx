import { useState } from "react";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { FileText, Star, Image as ImageIcon } from "lucide-react";
import { Place } from "@/types/place";
import { PartnershipPopulated } from "@/types/partnerships";
import { useAuth } from "@/hooks/useAuth";
import PresentationTab from "../PresentationTab";
import GallerySection from "@/components/userProfile/GallerySection/GallerySection";
import styles from "./MapCreatorCardContent.module.scss";
import { UserPopulated } from "@/types/user";

export interface MapCreatorCardContentProps {
  placeUser: UserPopulated | null;
  place: Place | null;
  eventPartnerships: PartnershipPopulated[];
  placePartnerships: PartnershipPopulated[];
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
}

const MapCreatorCardContent = ({
  placeUser,
  place,
  eventPartnerships,
  placePartnerships,
  onMapButtonClick,
}: MapCreatorCardContentProps) => {
  const [activeTab, setActiveTab] = useState("presentation");
  const { user: currentUser } = useAuth();

  // Check if current user is the owner of the place
  const isOwner = (() => {
    if (!currentUser || !place) return false;
    return currentUser._id === placeUser?._id;
  })();

  const tabs = [
    { id: "presentation", label: "Présentation", icon: FileText },
    { id: "reviews", label: "Avis", icon: Star },
    { id: "images", label: "Images", icon: ImageIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "presentation":
        return (
          <PresentationTab
            place={place}
            placeUser={placeUser}
            eventPartnerships={eventPartnerships}
            placePartnerships={placePartnerships}
            onMapButtonClick={onMapButtonClick}
          />
        );
      case "reviews":
        return place?._id ? (
          <ReviewsTab
            reference={place._id}
            referenceType="Place"
            canReview={!isOwner}
            canReply={isOwner}
          />
        ) : null;
      case "images":
        return (
          <GallerySection
            reference={placeUser?._id || null}
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
