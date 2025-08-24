"use client";

import { useParams, useRouter } from "next/navigation";
import EventForm from "@/components/events/form/EventForm/EventForm";
import styles from "./createEventPage.module.scss";
import PageHeader from "@/components/common/PageHeader/PageHeader";

const CreateEventPage = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <main className={styles.pageContainer}>
      <div className={styles.container}>
        <PageHeader
          title="Créer un événement"
          showBackButton={true}
          onBackClick={() =>
            router.push(`/account/places/${params.placeId}/events`)
          }
          backButtonLabel="Retour aux événements"
        />
        <EventForm />
      </div>
    </main>
  );
};

export default CreateEventPage;
