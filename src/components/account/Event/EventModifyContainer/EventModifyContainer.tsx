"use client";
import EventForm from "@/components/account/Event/EventForm/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { useEventInvitations } from "@/hooks/useEventInvitations";
import PageHeader from "@/components/common/PageHeader";
import styles from "./EventModifyContainer.module.scss";
import { Partnership } from "@/types/partnerships";

const EventModifyContainer = () => {
  const params = useParams();
  const eventId = params.eventId as string;
  const { event, isLoading: eventLoading } = useEvent(eventId);
  const { eventInvitations, isLoading: invitationsLoading } =
    useEventInvitations(eventId);

  const loading = eventLoading || invitationsLoading;

  return (
    <div className={styles.EventModifyContainer}>
      <section className={styles.container}>
        <PageHeader title="Modifier un événement" showBackButton={true} />
        {loading ? (
          <LoadingBar />
        ) : (
          <EventForm
            eventData={event}
            isUpdate={true}
            partnershipsData={eventInvitations as Partnership[]}
          />
        )}
      </section>
    </div>
  );
};

export default EventModifyContainer;
