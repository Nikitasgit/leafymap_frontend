"use client";

import React from "react";
import { Partnership } from "@/types/partnerships";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";
import Button from "@/components/common/buttons/Button";
import styles from "./PartnershipsReceivedList.module.scss";

interface PartnershipsReceivedListProps {
  partnerships: Partnership[];
  isLoading?: boolean;
  isUpdating?: boolean;
  onAccept?: (partnershipId: string) => void;
  onRefuse?: (partnershipId: string) => void;
}

export default function PartnershipsReceivedList({
  partnerships,
  isLoading = false,
  isUpdating = false,
  onAccept,
  onRefuse,
}: PartnershipsReceivedListProps) {
  if (isLoading) {
    return null;
  }

  if (partnerships.length === 0) {
    return null;
  }

  return (
    <div className={styles.list}>
      <ul className={styles.items}>
        {partnerships.map((partnership) => (
          <li key={partnership._id} className={styles.item}>
            <PartnershipCard
              user={
                partnership.initiator ?? {
                  _id: partnership._id,
                  username: "Utilisateur",
                }
              }
              showCategory
            />
            <div className={styles.actions}>
              <Button
                type="button"
                variant="primary"
                size="small"
                fullWidth
                onClick={() => onAccept?.(partnership._id)}
                disabled={isUpdating}
                ariaLabel="Accepter l'invitation"
              >
                Accepter
              </Button>
              <Button
                type="button"
                variant="outline"
                size="small"
                fullWidth
                onClick={() => onRefuse?.(partnership._id)}
                disabled={isUpdating}
                ariaLabel="Refuser l'invitation"
              >
                Refuser
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
