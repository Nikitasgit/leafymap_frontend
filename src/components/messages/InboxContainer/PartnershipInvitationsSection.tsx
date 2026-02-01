"use client";

import React from "react";
import { CreatorCard } from "@/components/userProfile/PlacesSection/CreatorCard";
import Button from "@/components/common/buttons/Button/Button";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserPlacesPartnershipsByUserId } from "@/hooks/useUserPlacesPartnershipsByUserId";
import { usePartnershipActions } from "@/hooks/usePartnershipActions";
import styles from "./InboxContainer.module.scss";

function isFullPlace(
  place: PartnershipPopulated["place"]
): place is NonNullable<PartnershipPopulated["place"]> & { _id: string } {
  return !!place && typeof place === "object" && "_id" in place;
}

export default function PartnershipInvitationsSection() {
  const { user } = useCurrentUser();
  const { partnerships, isLoading, refetch } =
    useUserPlacesPartnershipsByUserId(user?._id, {
      asCollaborator: "true",
      onlyAccepted: "false",
      onlyPending: "true",
    });
  const {
    acceptPartnership,
    refusePartnership,
    isLoading: isUpdating,
  } = usePartnershipActions(refetch);

  if (!user) return null;

  if (isLoading) return null;
  if (partnerships.length === 0) return null;

  return (
    <section className={styles.invitationSection}>
      <h2 className={styles.sectionTitle}>Propositions de collaboration</h2>
      <div className={styles.partnershipsList}>
        {partnerships.map((partnership) => {
          if (!isFullPlace(partnership.place)) return null;
          const place = partnership.place;
          const initiator = partnership.initiator;
          if (
            !initiator ||
            typeof initiator !== "object" ||
            !("_id" in initiator)
          )
            return null;
          return (
            <div key={partnership._id} className={styles.invitationCardWrapper}>
              <CreatorCard user={initiator as UserPopulated} place={place} />
              <div className={styles.invitationCardActions}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => acceptPartnership(partnership._id)}
                  disabled={isUpdating}
                  ariaLabel="Accepter l'invitation"
                  fullWidth
                >
                  Accepter
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => refusePartnership(partnership._id)}
                  disabled={isUpdating}
                  ariaLabel="Refuser l'invitation"
                  fullWidth
                >
                  Refuser
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
