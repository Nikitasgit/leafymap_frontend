import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./PartnershipCard.module.scss";
import creatorDefaultsSvg from "@public/images/creator_default.svg";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";
import { PartnershipPopulated } from "@/types/partnerships";

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

  const handleClick = () => {
    router.push(`/users/${user._id}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <Image
          src={user.image || creatorDefaultsSvg}
          alt={user.name || "Créateur"}
          width={50}
          height={50}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{user.name}</h4>
        {showCategory && user.category && user.category && (
          <CreatorCategoryBadge categoryName={user.category} />
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;
