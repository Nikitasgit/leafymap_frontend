import EventForm from "@/components/account/formComponents/Event/EventForm";
import styles from "./EventCreateContainer.module.scss";
import PageHeader from "@/components/common/PageHeader";

const EventCreateContainer = () => {
  return (
    <div className={styles.CreateEventContainer}>
      <section className={styles.container}>
        <PageHeader title="Créer un événement" showBackButton={true} />
        <EventForm />
      </section>
    </div>
  );
};

export default EventCreateContainer;
