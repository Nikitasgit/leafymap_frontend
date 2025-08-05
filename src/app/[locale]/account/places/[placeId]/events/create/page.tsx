"use client";

import EventForm from "@/components/events/form/EventForm/EventForm";
import styles from "./createEventPage.module.scss";
const CreateEventPage = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>Créer un événement</h1>
        <EventForm isUpdate={false} />
      </div>
    </main>
  );
};

export default CreateEventPage;
