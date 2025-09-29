import Image from "next/image";
import { useRouter } from "next/navigation";
import Text from "@/components/common/typography/Text";
import styles from "./PartnershipCard.module.scss";
import CreatorCategoryBadge from "../../common/users/creatorCategoryBadge";
import { PartnershipCardProps } from "./PartnershipCard.types";

const PartnershipCard: React.FC<PartnershipCardProps> = ({
  creator,
  showCategory = true,
  className = "",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/users/${creator._id}`);
  };

  const cardClass = `${styles.partnershipCard} ${className}`;

  return (
    <button className={cardClass} onClick={handleClick} type="button">
      <Image
        src={creator.image?.urls?.thumbnail || "https://i.pravatar.cc/40?img=3"}
        alt={creator.name || "Createur"}
        width={32}
        height={32}
        className={styles.avatar}
      />

      <div className={styles.creatorInfo}>
        <Text as="p" className={styles.creatorName}>
          {creator.name || "Createur"}
        </Text>

        {showCategory && creator.categories?.[0] && (
          <CreatorCategoryBadge categoryName={creator.categories[0].name} />
        )}
      </div>
    </button>
  );
};

export default PartnershipCard;
