import React from "react";
import { Users, MapPin } from "lucide-react";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import Button from "@/components/common/buttons/button/Button";
import { Image as ImageType } from "@/types/image";
import { User } from "@/types/user";
import styles from "./UserHeader.module.scss";
import ReviewsCounter from "@/components/common/counters/reviewsCounter";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";
import CreatorCategoryBadge from "@/components/common/users/creatorCategoryBadge";

interface UserHeaderProps {
  user: User;
  onFollow: () => void;
  onMessage: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  onFollow,
  onMessage,
}) => {
  const place = user.places?.[0];
  return (
    <header className={styles.header}>
      <ProfilePictureUploader
        onImageUploaded={() => {}}
        type="User"
        reference={user._id}
        initialImage={user.image as ImageType}
        isOwner={false}
        size="medium"
        className={styles.userImage}
      />
      <div className={styles.headerInfo}>
        <div className={styles.headerFirstRow}>
          <div className={styles.titleRow}>
            <Users size={18} className={styles.icon} />
            <Text as="h1" className={styles.title}>
              {user.creatorName}
            </Text>
            <CreatorCategoryBadge
              categoryName={user.creatorCategories[0].name}
            />
          </div>
          <div className={styles.counters}>
            <SubscribersCounter followers={user.followers?.length || 0} />
            {place && <ReviewsCounter rating={place.rating || 0} />}
          </div>
        </div>
        <div className={styles.headerMain}>
          <div className={styles.userDetails}>
            <Text as="p" className={styles.description}>
              {user.description}
            </Text>
            {place && place.location && (
              <div className={styles.locationInfo}>
                <MapPin size={14} />
                <Text as="p" className={styles.location}>
                  {place.location.label}
                </Text>
              </div>
            )}
          </div>
          <div className={styles.buttons}>
            <Button variant="outline" size="small" onClick={onFollow}>
              Suivre
            </Button>
            <Button variant="primary" size="small" onClick={onMessage}>
              Contacter
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
