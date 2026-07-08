import { UserPopulated } from "@/types/user";
import React from "react";
import styles from "./UserSuggestionCard.module.scss";
import Image from "next/image";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import creatorDefaultSvg from "@public/images/creator_default.png";
import { getDisplayName } from "@/utils/userDisplay";

const UserSuggestionCard = ({ user }: { user: UserPopulated }) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push(`/users/${user._id}`);
  };

  const locationLabel =
    user.place?.location?.label || user.location?.label || null;

  return (
    <a
      className={styles.userSuggestionCard}
      onClick={handleRedirect}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <Image
          src={
            user.image?.urls?.medium ||
            user.googlePictureUrl ||
            creatorDefaultSvg
          }
          alt={getDisplayName(user)}
          fill
          sizes="(min-width: 768px) 220px, (min-width: 576px) 200px, 160px"
          className={styles.image}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.title}>{getDisplayName(user)}</h3>
        {locationLabel && (
          <div className={styles.locationContainer}>
            <MapPin size={18} />
            <p className={styles.location}>{locationLabel}</p>
          </div>
        )}
        <p className={styles.description}>
          {user.description || "Aucune description disponible"}
        </p>
        {user.userCategory?.name && (
          <CreatorCategoryBadge categoryName={user.userCategory.name} />
        )}
      </div>
    </a>
  );
};

export default UserSuggestionCard;
