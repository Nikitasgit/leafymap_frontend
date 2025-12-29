import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./PartnershipCard.module.scss";
import creatorDefaultsSvg from "@public/images/creator_default.svg";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";
import { PartnershipPopulated } from "@/types/partnerships";

interface PartnershipCardProps {
  creator: PartnershipPopulated["collaborator"];
  showCategory?: boolean;
}

const PartnershipCard = ({ creator, showCategory = false }: PartnershipCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/users/${creator._id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.imageContainer}>
        <Image
          src={
            typeof creator.image === "object"
              ? creator.image?.urls?.thumbnail
              : creator.image || creatorDefaultsSvg
          }
          alt={creator.name || "Créateur"}
          width={80}
          height={80}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{creator.name}</h4>
        {showCategory && creator.categories && creator.categories.length > 0 && (
          <CreatorCategoryBadge categoryName={creator.categories[0].name} />
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;

