import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import ThreeDotsMenu from "@/components/common/ThreeDotsMenu";
import styles from "./PartnershipCard.module.scss";
import creatorDefaultsSvg from "@public/images/creator_default.svg";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";
import type { PartnershipCardProps } from "./PartnershipCard.types";

const PartnershipCard = ({
  user,
  showCategory = false,
  className,
  actions = [],
}: PartnershipCardProps) => {
  const router = useRouter();

  const imageUrl =
    typeof user.image === "string"
      ? user.image
      : (user.image?.urls?.thumbnail ?? "");

  const displayName = user.username ?? "Utilisateur";
  const categoryName = user.userCategory?.name;
  const hasActions = actions.length > 0;

  const handleButtonClick = () => {
    router.push(`/users/${user._id}`);
  };

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {hasActions && (
        <ThreeDotsMenu
          className={styles.cardActions}
          actions={actions}
          ariaLabel="Ouvrir le menu"
        />
      )}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl || creatorDefaultsSvg}
          alt={displayName || "Créateur"}
          width={60}
          height={60}
          className={styles.image}
        />
        <button
          className={styles.iconButton}
          onClick={handleButtonClick}
          aria-label={`Voir le profil de ${displayName}`}
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
