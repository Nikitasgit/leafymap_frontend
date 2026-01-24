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

  const handleButtonClick = () => {
    router.push(`/users/${user._id}`);
  };

  return (
    <div className={styles.card}>
      <button
        className={styles.iconButton}
        onClick={handleButtonClick}
        aria-label={`Voir le profil de ${user.name}`}
        type="button"
      >
        <ExternalLink size={12} />
      </button>
      <div className={styles.imageContainer}>
        <Image
          src={user.image || creatorDefaultsSvg}
          alt={user.name || "Créateur"}
          width={60}
          height={60}
          className={styles.image}
          draggable={false}
        />
      </div>
      <h4 className={styles.name}>{user.name}</h4>
      {showCategory && user.category && (
        <CreatorCategoryBadge categoryName={user.category} />
      )}
    </div>
  );
};

export default PartnershipCard;
