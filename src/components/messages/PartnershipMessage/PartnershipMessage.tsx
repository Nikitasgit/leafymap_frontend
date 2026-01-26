"use client";

import React from "react";
import { User } from "@/types/user";
import Button from "@/components/common/buttons/Button";
import { Check, X } from "lucide-react";
import styles from "./PartnershipMessage.module.scss";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import PlaceCard from "@/components/userProfile/PlacesSection/PlaceCard/PlaceCard";
import EventCard from "@/components/common/events/EventCard/EventCard";
import { UserPopulated } from "@/types/user";

interface PartnershipMessageProps {
  partnership: PartnershipPopulated;
  currentUser: User;
  onStatusChange: (
    partnerships: Partnership[],
    isUpdate: boolean,
    placeId: string,
    eventId: string
  ) => void;
  isLoading?: boolean;
}

export default function PartnershipMessage({
  partnership,
  onStatusChange,
  isLoading = false,
}: PartnershipMessageProps) {
  const event =
    partnership.event && typeof partnership.event === "object"
      ? partnership.event
      : null;
  const user = partnership.initiator as UserPopulated;
  return (
    <div className={styles.partnershipCard}>
      {partnership.type === "event" && event && (
        <div className={styles.eventContainer}>
          <EventCard event={event} user={user} place={partnership.place} />
        </div>
      )}
      <div className={styles.actions}>
        <>
          <Button
            variant={
              partnership.status === "accepted" ? "primary" : "secondary"
            }
            size="small"
            ariaLabel="Accepter"
            onClick={() =>
              onStatusChange?.(
                [{ ...partnership, status: "accepted" }],
                true,
                partnership.place._id,
                partnership.event?._id
              )
            }
            disabled={isLoading}
            className={styles.actionButton}
            startIcon={<Check size={16} />}
          >
            {partnership.status === "accepted" ? "Acceptée" : "Accepter"}
          </Button>
          <Button
            variant={partnership.status === "refused" ? "primary" : "secondary"}
            size="small"
            ariaLabel="Refuser"
            onClick={() =>
              onStatusChange?.(
                [{ ...partnership, status: "refused" }],
                true,
                partnership.place._id,
                partnership.event?._id
              )
            }
            disabled={isLoading}
            className={styles.actionButton}
            startIcon={<X size={16} />}
          >
            {partnership.status === "refused" ? "Refusée" : "Refuser"}
          </Button>
        </>
      </div>
    </div>
  );
}
