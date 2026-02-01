"use client";

import React from "react";
import { MapPin, Calendar } from "lucide-react";
import styles from "./PartnershipMessage.module.scss";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import { CreatorCard } from "@/components/userProfile/PlacesSection/CreatorCard";
import EventCard from "@/components/common/events/EventCard/EventCard";

export interface MessagePartnership {
  type?: "event" | "place";
  event?: { name?: string };
  place?: { location?: { label?: string } };
}

interface PartnershipMessageProps {
  partnership: PartnershipPopulated | MessagePartnership;
  sender?: { username?: string };
}

export default function PartnershipMessage({
  partnership,
  sender,
}: PartnershipMessageProps) {
  const senderName =
    sender?.username ||
    (partnership as PartnershipPopulated).initiator?.username ||
    "Utilisateur";

  const isEvent = partnership.type === "event" || !!partnership.event?.name;
  const isPlace = partnership.type === "place" || !!partnership.place?.location;

  const fullEvent =
    (partnership as PartnershipPopulated).event &&
    typeof (partnership as PartnershipPopulated).event === "object" &&
    "_id" in (partnership as PartnershipPopulated).event;
  const fullPlace =
    (partnership as PartnershipPopulated).place &&
    typeof (partnership as PartnershipPopulated).place === "object" &&
    "_id" in (partnership as PartnershipPopulated).place;

  if (isEvent) {
    const event = (partnership as PartnershipPopulated).event;
    const place = (partnership as PartnershipPopulated).place;
    const initiator = (partnership as PartnershipPopulated)
      .initiator as UserPopulated;

    return (
      <div className={styles.partnershipCard}>
        <p className={styles.invitationMessage}>
          <strong>{senderName}</strong> vous envoie une invitation à participer
          à un événement
        </p>
        {fullEvent && event && typeof event === "object" ? (
          <div className={styles.eventContainer}>
            <EventCard
              event={event}
              user={initiator}
              place={place}
              clickable={!!event._id}
            />
          </div>
        ) : (
          partnership.event?.name && (
            <div className={styles.compactCard}>
              <Calendar size={18} className={styles.compactIcon} />
              <span>{partnership.event.name}</span>
            </div>
          )
        )}
      </div>
    );
  }

  if (isPlace) {
    const place = (partnership as PartnershipPopulated).place;
    const initiator = (partnership as PartnershipPopulated)
      .initiator as UserPopulated;

    return (
      <div className={styles.partnershipCard}>
        <p className={styles.invitationMessage}>
          <strong>{senderName}</strong> souhaite vous ajouter comme
          collaborateur de son lieu
        </p>
        {fullPlace && place && typeof place === "object" ? (
          <div className={styles.placeContainer}>
            <CreatorCard user={initiator} place={place} />
          </div>
        ) : (
          partnership.place?.location?.label && (
            <div className={styles.compactCard}>
              <MapPin size={18} className={styles.compactIcon} />
              <span>{partnership.place.location.label}</span>
            </div>
          )
        )}
      </div>
    );
  }

  return null;
}
