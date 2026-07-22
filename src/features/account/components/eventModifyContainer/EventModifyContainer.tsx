"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Pencil, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import LoadingBar from "@/shared/ui/loading/loadingBar";
import PageHeader from "@/shared/ui/pageHeader";
import TabsContainer from "@/shared/ui/tabs/tabsContainer";
import Tab from "@/shared/ui/tabs/tab";
import EventForm from "@/features/events/components/eventForm";
import { useEvent } from "@/features/events/hooks/useEvent";
import EventBookingsManageTab from "@/features/eventBookings/components/eventBookingsManageTab";
import { useEventInvitations } from "@/features/eventInvitations/hooks/useEventInvitations";
import type { Partnership } from "@/features/partnerships/types";
import styles from "./EventModifyContainer.module.scss";

const EventModifyContainer = () => {
  const { t } = useTranslation("events");
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
        <PageHeader title={t("eventModifyContainer.title")} showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <>
            {showBookingsTab && (
              <TabsContainer>
                <Tab
                  id="edit"
                  label={t("eventModifyContainer.editTab")}
                  icon={Pencil}
                  isActive={activeTab === "edit"}
                  onClick={setActiveTab}
                />
                <Tab
                  id="bookings"
                  label={t("eventModifyContainer.bookingsTab")}
                  icon={Ticket}
                  isActive={activeTab === "bookings"}
                  onClick={setActiveTab}
                />
              </TabsContainer>
            )}
            <div className={styles.content}>
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
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default EventModifyContainer;
