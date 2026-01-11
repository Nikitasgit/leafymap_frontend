import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import styles from "./PartnershipCard.module.scss";
import creatorDefaultsSvg from "@public/images/creator_default.svg";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";

interface PartnershipCardProps {
  user: {
    _id: string;
    name: string;
    image: string;
    category: string;
  };

  showCategory?: boolean;
}

const PartnershipCard = ({
  user,
  showCategory = false,
}: PartnershipCardProps) => {
  const router = useRouter();

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/users/${user._id}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={user.image || creatorDefaultsSvg}
          alt={user.name || "Créateur"}
          width={50}
          height={50}
          className={styles.image}
          draggable={false}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h4 className={styles.name}>blablablablablablablabla</h4>
          <button
            className={styles.iconButton}
            onClick={handleIconClick}
            aria-label={`Voir le profil de ${user.name}`}
            type="button"
          >
            <ExternalLink size={14} />
          </button>
        </div>
        {showCategory && user.category && user.category && (
          <CreatorCategoryBadge categoryName={user.category} />
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;
