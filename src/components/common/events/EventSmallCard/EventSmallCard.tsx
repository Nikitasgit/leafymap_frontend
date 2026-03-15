import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import styles from "./EventSmallCard.module.scss";
import { EventSmallCardProps } from "./EventSmallCard.types";
import eventDefaultsSvg from "@public/images/event_default.svg";
import { capitalizeFirstLetter } from "@/utils/functions";

const EventSmallCard: React.FC<EventSmallCardProps> = ({
  event,
  enableNavigation = true,
  className,
}) => {
  const eventId = event._id || event.id;

  const cardClassName = `${styles.eventCard} ${className || ""}`;

  return (
    <div className={cardClassName}>
      <div className={styles.eventImageContainer}>
        <Image
          src={event.image?.urls?.thumbnail || eventDefaultsSvg}
          alt={event.name}
          fill
          sizes="28px"
          className={styles.placeImage}
        />
      </div>
      <div className={styles.eventInfo}>
        <span className={styles.eventName}>
          {capitalizeFirstLetter(event.name)}
        </span>
      </div>
    </div>
  );
};

export default EventSmallCard;
