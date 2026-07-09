"use client";

import EventForm from "@/components/account/Event/EventForm";
import styles from "./EventCreateContainer.module.scss";
import PageHeader from "@/components/common/PageHeader";
import { useTranslation } from "react-i18next";

const EventCreateContainer = () => {
  const { t } = useTranslation("events");

  return (
    <div className={styles.CreateEventContainer}>
      <section className={styles.container}>
        <PageHeader title={t("eventCreateContainer.title")} showBackButton={true} />
        <EventForm />
      </section>
    </div>
  );
};

export default EventCreateContainer;
