"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import styles from "./CreatorCardWithAddress.module.scss";

export interface CreatorCardWithAddressProps {
  /** URL de l'image du créateur (ex. thumbnail) */
  imageUrl?: string | null;
  /** Nom d'affichage du créateur (username) */
  username: string;
  /** Adresse ou lieu (ex. place.location.label) */
  address: string;
  className?: string;
}

const CreatorCardWithAddress: React.FC<CreatorCardWithAddressProps> = ({
  imageUrl,
  username,
  address,
  className,
}) => {
  const { t } = useTranslation("common");
  const displayName = username || t("creatorCardWithAddress.defaultUser");

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayName}
            width={40}
            height={40}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            {displayName[0]?.toUpperCase() ?? "U"}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.username}>{displayName}</span>
        <span className={styles.address}>
          <MapPin size={14} className={styles.addressIcon} aria-hidden />
          {address}
        </span>
      </div>
    </div>
  );
};

export default CreatorCardWithAddress;
