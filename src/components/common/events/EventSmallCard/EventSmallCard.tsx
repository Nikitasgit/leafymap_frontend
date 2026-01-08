import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./EventSmallCard.module.scss";
import { EventSmallCardProps } from "./EventSmallCard.types";
import eventDefaultsSvg from "@public/images/event_default.svg";
import { capitalizeFirstLetter } from "@/utils/functions";

const EventSmallCard: React.FC<EventSmallCardProps> = ({
  event,
  enableNavigation = true,
  className,
}) => {
  const router = useRouter();
  const eventId = event._id || event.id;

  const handleClick = () => {
    if (enableNavigation && eventId) {
      router.push(`/events/${eventId}`);
    }
  };

  const Component = enableNavigation && eventId ? "button" : "div";
  const componentProps =
    enableNavigation && eventId
      ? {
          type: "button" as const,
          onClick: handleClick,
          "aria-label": `Voir l'événement ${event.name}`,
        }
      : {};

  const cardClassName = `${styles.eventCard} ${
    enableNavigation && eventId ? styles.clickable : ""
  } ${className || ""}`;

  return (
    <Component className={cardClassName} {...componentProps}>
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
      {enableNavigation && eventId && (
        <ExternalLink
          size={14}
          className={styles.eventIcon}
          aria-hidden="true"
        />
      )}
    </Component>
  );
};

export default EventSmallCard;
