"use client";

import React from "react";
import { MapPin } from "lucide-react";
import styles from "./PartnershipMessage.module.scss";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import { CreatorCard } from "@/components/userProfile/PlacesSection/CreatorCard";

export interface MessagePartnership {
  type?: "place";
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

  const isPlace =
    ("type" in partnership && partnership.type === "place") ||
    !!partnership.place?.location;

  const fullPlace =
    (partnership as PartnershipPopulated).place &&
    typeof (partnership as PartnershipPopulated).place === "object" &&
    "_id" in (partnership as PartnershipPopulated).place;

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
