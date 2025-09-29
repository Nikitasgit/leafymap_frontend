"use client";
import TitleWithLine from "@/components/common/typography/titleWithLine";
import styles from "./EventInfo.module.scss";
import EventInfoProps from "./EventInfo.types";

const EventInfo: React.FC<EventInfoProps> = ({ description }) => {
  return (
    <section className={styles.eventInfo}>
      <TitleWithLine>Description de l&apos;évènement</TitleWithLine>
      <p className={styles.eventDescription}>{description}</p>
    </section>
  );
};

export default EventInfo;
