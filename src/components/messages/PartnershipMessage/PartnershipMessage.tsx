"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/types/user";
import Button from "@/components/common/buttons/Button";
import { Check, X } from "lucide-react";
import styles from "./PartnershipMessage.module.scss";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import DateRange from "@/components/common/dateRange";
import EventStatus from "@/components/common/events/EventStatus";
import { capitalizeFirstLetter } from "@/utils/functions";
import eventDefaultsSvg from "@public/images/event_default.svg";
import placeDefaultsSvg from "@public/images/place_default.svg";

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

  return (
    <div className={styles.partnershipCard}>
      <div className={styles.placeContainer}>
        <div className={styles.imageContainer}>
          <Image
            src={partnership.place.image?.urls?.thumbnail || placeDefaultsSvg}
            alt={partnership.place.name}
            width={32}
            height={32}
            className={styles.placeImage}
          />
        </div>
        <div className={styles.placeInfo}>
          <div className={styles.placeDetails}>
            <span className={styles.placeName}>
              {capitalizeFirstLetter(partnership.place.name)}
            </span>
            <span className={styles.placeAddress}>
              {partnership.place.location?.label}
            </span>
          </div>
        </div>
      </div>
      {partnership.type === "event" && (
        <div className={styles.eventContainer}>
          <div className={styles.eventInfo}>
            <div className={styles.eventDetails}>
              <span className={styles.eventLabel}>Événement</span>
              <span className={styles.eventName}>
                {capitalizeFirstLetter(partnership.event?.name)}
              </span>
              {event && event.dateRange?.firstDate && (
                <div className={styles.scheduleInfo}>
                  <div className={styles.scheduleItem}>
                    <Image
                      src={event.image?.urls?.thumbnail || eventDefaultsSvg}
                      alt={event.name || "Event"}
                      width={32}
                      height={32}
                      className={styles.eventImage}
                    />
                    <p className={styles.scheduleText}>
                      <DateRange dateRange={event.dateRange} />
                    </p>
                    <EventStatus status={event.lifecycleStatus} />
                  </div>
                </div>
              )}
            </div>
          </div>
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
