"use client";
import EventForm from "@/components/events/form/EventForm/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";
import styles from "../editEventPage.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";

const UpdateEventPage = () => {
  const { eventId, placeId } = useParams();
  const { event, isLoading } = useEvent(eventId as string);
  const { partnerships, loading: partnershipsLoading } = usePlacePartnerships(
    placeId as string,
    eventId as string
  );

  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Modifier un événement</h1>
        {isLoading || partnershipsLoading ? (
          <LoadingBar />
        ) : (
          <EventForm data={event} isUpdate={true} partnerships={partnerships} />
        )}
      </div>
    </main>
  );
};

export default UpdateEventPage;
