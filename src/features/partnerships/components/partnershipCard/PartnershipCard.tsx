"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import ThreeDotsMenu from "@/shared/ui/threeDotsMenu";
import styles from "./PartnershipCard.module.scss";
import creatorDefaultsSvg from "@public/images/creator_default.png";
import CreatorCategoryBadge from "@/features/users/components/creatorCategoryBadge";
import type { PartnershipCardProps } from "./PartnershipCard.types";

const PartnershipCard = ({
  user,
  showCategory = false,
  className,
  actions = [],
}: PartnershipCardProps) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const imageUrl =
    typeof user.image === "string"
      ? user.image
      : (user.image?.urls?.thumbnail ?? "");

  const displayName = user.username ?? t("partnershipCard.defaultUser");
  const categoryName = user.userCategory?.name;
  const hasActions = actions.length > 0;

  const handleButtonClick = () => {
    router.push(`/users/${user.id}`);
  };

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {hasActions && (
        <ThreeDotsMenu
          className={styles.cardActions}
          actions={actions}
          ariaLabel={t("partnershipCard.openMenuAriaLabel")}
        />
      )}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl || user.googlePictureUrl || creatorDefaultsSvg}
          alt={displayName || t("partnershipCard.creatorAlt")}
          width={60}
          height={60}
          className={styles.image}
        />
        <button
          className={styles.iconButton}
          onClick={handleButtonClick}
          aria-label={t("partnershipCard.viewProfileAriaLabel", {
            name: displayName,
          })}
          type="button"
        >
          <ExternalLink size={12} />
        </button>
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{displayName}</h4>
        {showCategory && categoryName && (
          <CreatorCategoryBadge categoryName={categoryName} />
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;
