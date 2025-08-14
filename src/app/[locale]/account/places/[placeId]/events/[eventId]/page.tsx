"use client";
import EventForm from "@/components/events/form/EventForm/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";
import styles from "../editEventPage.module.scss";
import LoadingBar from "@/components/common/loading/LoadingBar";

const UpdateEventPage = () => {
  const { eventId } = useParams();
  const { event, isLoading } = useEvent(eventId as string);

  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Modifier un événement</h1>
        {isLoading ? (
          <LoadingBar />
        ) : (
          <EventForm data={event} isUpdate={true} />
        )}
      </div>
    </main>
  );
};

export default UpdateEventPage;
