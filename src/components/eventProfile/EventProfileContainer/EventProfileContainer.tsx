"use client";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useEvent } from "@/hooks/useEvent";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./EventProfileContainer.module.scss";
import EventProfileSchedule from "@/components/eventProfile/EventProfileSchedule";
import EventHeader from "@/components/eventProfile/EventHeader";
import EventInfo from "@/components/eventProfile/EventInfo";
import PartnershipsList from "@/components/common/partnerships/PartnershipsList";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";
import { PartnershipPopulated } from "@/types/partnerships";
import TabsContainer from "@/components/common/tabs/TabsContainer/TabsContainer";
import Tab from "@/components/common/tabs/Tab/Tab";
import { Calendar as CalendarIcon, Star } from "lucide-react";
import ReviewsTab from "@/components/reviews/ReviewsTab/ReviewsTab";
import { useAuth } from "@/hooks/useAuth";

const EventProfileContainer = () => {
  const { eventId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("schedule");
  const { user: currentUser } = useAuth();
  const {
    event,
    isLoading,
    refetch: refetchEvent,
  } = useEvent(eventId as string);

  const { partnerships, isLoading: partnershipsLoading } = usePlacePartnerships(
    event?.place?._id as string,
    eventId as string,
    "event"
  );

  // Initialize tab from URL on mount
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const tabs = ["schedule", "reviews"];
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabId);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const tabs = [
    { id: "schedule", label: "Programme", icon: CalendarIcon },
    { id: "reviews", label: "Avis", icon: Star },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <>
            <EventInfo description={event?.description || ""} />
            <PartnershipsList
              partnerships={partnerships as PartnershipPopulated[]}
            />
            <EventProfileSchedule
              partnerships={partnerships as PartnershipPopulated[]}
              schedule={event?.schedule || []}
            />
          </>
        );
      case "reviews":
        return event ? (
          <ReviewsTab
            reference={event._id}
            referenceType="Event"
            canReview={!isOwner}
            canReply={isOwner || false}
            onRatingUpdated={refetchEvent}
          />
        ) : null;
      default:
        return null;
    }
  };

  if (isLoading || partnershipsLoading || !event) return <LoadingBar />;

  const isOwner =
    currentUser && event?.place && currentUser._id === event.place.user;

  return (
    <div className={styles.pageContainer}>
      <article className={styles.container}>
        <EventHeader event={event} />
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
      </article>
    </div>
  );
};

export default EventProfileContainer;
