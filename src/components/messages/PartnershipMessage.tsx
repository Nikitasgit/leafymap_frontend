"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/types/user";
import Button from "@/components/common/buttons/button/Button";
import { Check, X } from "lucide-react";
import styles from "./PartnershipMessage.module.scss";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import { getEventDateRange } from "@/utils/eventDates";
import { format } from "date-fns";
import Text from "../common/typography/Text";
import { fr } from "date-fns/locale";

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
  const getEventStatus = (status: string) => {
    switch (status) {
      case "upcoming":
        return { label: "À venir", color: "upcoming" };
      case "ongoing":
        return { label: "En cours", color: "ongoing" };
      case "completed":
        return { label: "Terminé", color: "completed" };
      case "cancelled":
        return { label: "Annulé", color: "cancelled" };
      case "full":
        return { label: "Complet", color: "full" };
      case "unvalid":
        return { label: "Dates invalides", color: "unvalid" };
      default:
        return { label: "À venir", color: "upcoming" };
    }
  };

  const statusDisplay = getEventStatus(partnership.event?.status);
  const dateRange = getEventDateRange(partnership.event?.schedule || []);
  return (
    <div className={styles.partnershipCard}>
      <div className={styles.placeContainer}>
        <div className={styles.imageContainer}>
          <Image
            src={partnership.place.image?.urls?.thumbnail || ""}
            alt={partnership.place.name}
            width={32}
            height={32}
            className={styles.placeImage}
          />
        </div>
        <div className={styles.placeInfo}>
          <div className={styles.placeDetails}>
            <span className={styles.placeName}>{partnership.place.name}</span>
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
                {partnership.event?.name}
              </span>
              {dateRange.firstDate && (
                <div className={styles.scheduleInfo}>
                  <div className={styles.scheduleItem}>
                    <Image
                      src={
                        partnership.event?.image?.urls?.thumbnail ||
                        "https://i.pravatar.cc/40?img=3"
                      }
                      alt={partnership.event?.name}
                      width={32}
                      height={32}
                      className={styles.eventImage}
                    />
                    <Text as="p" className={styles.scheduleText}>
                      {format(new Date(dateRange.firstDate), "dd MMM yyyy", {
                        locale: fr,
                      })}
                      {dateRange.latestDate &&
                        dateRange.latestDate !== dateRange.firstDate && (
                          <>
                            {" "}
                            -{" "}
                            {format(
                              new Date(dateRange.latestDate),
                              "dd MMM yyyy",
                              {
                                locale: fr,
                              }
                            )}
                          </>
                        )}
                    </Text>
                    <span
                      className={`${styles.status} ${
                        styles[statusDisplay.color]
                      }`}
                    >
                      {statusDisplay.label}
                    </span>
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
