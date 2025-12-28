import { Users, MapPin } from "lucide-react";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploader";
import Button from "@/components/common/buttons/Button";
import { Image as ImageType } from "@/types/image";
import { UserPopulated } from "@/types/user";
import styles from "./UserHeader.module.scss";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter";
import CreatorCategoryBadge from "@/components/common/users/CreatorCategoryBadge";
import BackButton from "@/components/common/buttons/BackButton";
import StarsDisplay from "@/components/common/stars/StarsDisplay/StarsDisplay";

interface UserHeaderProps {
  user: UserPopulated;
  onFollow: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, onFollow }) => {
  const place = user.places?.[0];
  return (
    <header className={styles.header}>
      <BackButton />
      <div className={styles.topRow}>
        <ProfilePictureUploader
          onImageUploaded={() => {}}
          type="User"
          reference={user._id}
          initialImage={user.image as ImageType}
          isOwner={false}
          size="medium"
          className={styles.userImage}
        />
        <div className={styles.middleSection}>
          <div className={styles.counters}>
            <SubscribersCounter followers={user.followers?.length || 0} />
          </div>
          <CreatorCategoryBadge categoryName={user.userCategories[0].name} />
          <Button variant="outline" size="small" onClick={onFollow}>
            Suivre
          </Button>
        </div>
        {user.rating > 0 && (
          <div className={styles.ratingSection}>
            <StarsDisplay rating={user.rating} size="small" />
            <span className={styles.ratingValue}>
              ({user.rating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.titleRow}>
          <Users size={18} className={styles.icon} />
          <h1 className={styles.title}>{user.creatorName}</h1>
        </div>
        {place && place.location && (
          <div className={styles.locationInfo}>
            <MapPin size={14} />
            <p className={styles.location}>{place.location.label}</p>
          </div>
        )}
        <p className={styles.description}>{user.description}</p>
      </div>
    </header>
  );
};

export default UserHeader;
