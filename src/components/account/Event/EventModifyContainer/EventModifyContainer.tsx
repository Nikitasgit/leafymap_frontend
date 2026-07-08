"use client";
import EventForm from "@/components/account/Event/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Pencil, Ticket } from "lucide-react";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useEventInvitations } from "@/hooks/useEventInvitations";
import PageHeader from "@/components/common/PageHeader";
import TabsContainer from "@/components/common/tabs/TabsContainer";
import Tab from "@/components/common/tabs/Tab";
import EventBookingsManageTab from "@/components/account/Event/EventBookingsManageTab";
import styles from "./EventModifyContainer.module.scss";
import { Partnership } from "@/types/partnerships";

const EventModifyContainer = () => {
  const params = useParams();
  const eventId = params.eventId as string;
  const { event, isLoading: eventLoading } = useEvent(eventId);
  const { eventInvitations, isLoading: invitationsLoading } =
    useEventInvitations(eventId);
  const [activeTab, setActiveTab] = useState("edit");

  const loading = eventLoading || invitationsLoading;
  const showBookingsTab = !loading && !!event?.isBookable;

  return (
    <div className={styles.EventModifyContainer}>
      <section className={styles.container}>
        <PageHeader title="Modifier un événement" showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <>
            {showBookingsTab && (
              <TabsContainer>
                <Tab
                  id="edit"
                  label="Modifier"
                  icon={Pencil}
                  isActive={activeTab === "edit"}
                  onClick={setActiveTab}
                />
                <Tab
                  id="bookings"
                  label="Réservations"
                  icon={Ticket}
                  isActive={activeTab === "bookings"}
                  onClick={setActiveTab}
                />
              </TabsContainer>
            )}
            {showBookingsTab && activeTab === "bookings" ? (
              <EventBookingsManageTab
                eventId={eventId}
                maxSeatsPerBooking={event?.maxSeatsPerBooking || 1}
                capacity={event?.capacity}
                bookedSeats={event?.bookedSeats}
                hasEventStarted={event?.lifecycleStatus !== "upcoming"}
              />
            ) : (
              <EventForm
                eventData={event}
                isUpdate={true}
                partnershipsData={eventInvitations as Partnership[]}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default EventModifyContainer;
