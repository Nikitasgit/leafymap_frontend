"use client";

import EventForm from "../eventForm";
import styles from "./EventCreateContainer.module.scss";
import PageHeader from "@/shared/ui/pageHeader";
import { useTranslation } from "react-i18next";

const EventCreateContainer = () => {
  const { t } = useTranslation("events");

  return (
    <div className={styles.CreateEventContainer}>
      <section className={styles.container}>
        <PageHeader title={t("eventCreateContainer.title")} showBackButton={true} />
        <div className={styles.content}>
          <EventForm />
        </div>
      </section>
    </div>
  );
};

export default EventCreateContainer;
