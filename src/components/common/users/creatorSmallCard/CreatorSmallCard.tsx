import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Text from "@/components/common/typography/Text";
import styles from "./CreatorSmallCard.module.scss";
import CreatorCategoryBadge from "../creatorCategoryBadge";

interface CreatorSmallCardProps {
  creator: {
    _id: string;
    name?: string;
    image?: {
      urls?: {
        thumbnail?: string;
      };
    };
    categories?: Array<{
      name: string;
    }>;
  };
  showCategory?: boolean;
  className?: string;
}

const CreatorSmallCard: React.FC<CreatorSmallCardProps> = ({
  creator,
  showCategory = true,
  className = "",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/users/${creator._id}`);
  };

  const cardClass = `${styles.creatorCard} ${className}`;

  return (
    <div className={cardClass} onClick={handleClick}>
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
    </div>
  );
};

export default CreatorSmallCard;
