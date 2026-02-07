"use client";

import React from "react";
import { Partnership } from "@/types/partnerships";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";
import Button from "@/components/common/buttons/Button";
import EmptyState from "@/components/common/noResults/EmptyState";
import { Send } from "lucide-react";
import styles from "./PartnershipsSentList.module.scss";

interface PartnershipsSentListProps {
  partnerships: Partnership[];
  isLoading?: boolean;
  onCancel?: (partnershipId: string) => void;
}

export default function PartnershipsSentList({
  partnerships,
  isLoading = false,
  onCancel,
}: PartnershipsSentListProps) {
  if (isLoading) {
    return null;
  }

  if (partnerships.length === 0) {
    return (
      <EmptyState
        title="Aucune invitation envoyée"
        icon={<Send className={styles.icon} />}
      />
    );
  }

  return (
    <div className={styles.list}>
      <h3 className={styles.title}>Invitations envoyées</h3>
      <ul className={styles.items}>
        {partnerships.map((partnership) => (
          <li key={partnership._id} className={styles.item}>
            <PartnershipCard user={partnership.collaborator} showCategory />
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => onCancel?.(partnership._id)}
              ariaLabel="Annuler l'invitation"
            >
              Annuler l&apos;invitation
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
