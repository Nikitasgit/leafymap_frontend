"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import styles from "./PartnershipMessage.module.scss";
import type { PartnershipPopulated } from "@/features/partnerships/types";
import { UserPopulated } from "@/features/users/types";
import CreatorCard from "@/features/users/components/creatorCard";
import type { MessagePartnership } from "../../types";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

interface PartnershipMessageProps {
  partnership: PartnershipPopulated | MessagePartnership;
  sender?: { username?: string };
}

export default function PartnershipMessage({
  partnership,
  sender,
}: PartnershipMessageProps) {
  const { t } = useTranslation("messages");
  const senderName =
    sender?.username ||
    (partnership as PartnershipPopulated).initiator?.username ||
    t("partnershipMessage.defaultUser");

  const isPlace =
    ("type" in partnership && partnership.type === "place") ||
    !!partnership.place?.location;

  const fullPlace = resolveRefObject(
    (partnership as PartnershipPopulated).place,
  );

  if (isPlace) {
    const initiator = (partnership as PartnershipPopulated)
      .initiator as UserPopulated;

    return (
      <div className={styles.partnershipCard}>
        <p className={styles.invitationMessage}>
          <Trans
            i18nKey="partnershipMessage.invitation"
            ns="messages"
            values={{ senderName }}
            components={{ strong: <strong /> }}
          />
        </p>
        {fullPlace ? (
          <div className={styles.placeContainer}>
            <CreatorCard user={initiator} place={fullPlace} />
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
