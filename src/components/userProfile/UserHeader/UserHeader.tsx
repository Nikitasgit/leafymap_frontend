import React from "react";
import { Star, Users, ArrowLeft, EllipsisVertical } from "lucide-react";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader";
import Button from "@/components/common/buttons/button/Button";
import { Image as ImageType } from "@/types/image";
import { User } from "@/types/user";
import { Place } from "@/types/place";
import styles from "./UserHeader.module.scss";

interface UserHeaderProps {
  user: User;
  place?: Place;
  onFollow: () => void;
  onMessage: () => void;
  onBack: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  place,
  onFollow,
  onMessage,
  onBack,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${styles.star} ${
          index < rating ? styles.filled : styles.empty
        }`}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <section className={styles.header}>
      <div className={styles.topBar}>
        <Button variant="simple" onClick={onBack} className={styles.backButton}>
          <ArrowLeft size={20} />
        </Button>
      </div>
      <div className={styles.headerMain}>
        <ProfilePictureUploader
          onImageUploaded={() => {}}
          type="User"
          reference={user._id}
          initialImage={user.image as ImageType}
          isOwner={false}
          size="small"
          rounded
        />

        <div className={styles.userInfo}>
          <Text as="h1">{user.creatorName}</Text>
          <div className={styles.counters}>
            <div className={styles.counterRow}>
              <span className={styles.counter}>
                {user.followers?.length || 0}
              </span>
              <Users size={12} />
            </div>
            {place && (
              <div className={styles.counterRow}>
                <span className={styles.counter}>{place.rating}</span>
                <div className={styles.starsContainer}>
                  {renderStars(place.rating || 0)}
                </div>
              </div>
            )}
          </div>
          <Text as="p" className={styles.description}>
            {user.description}
          </Text>
        </div>

        <div className={styles.buttonsContainer}>
          <Button
            variant="simple"
            onClick={() => {}}
            className={styles.menuButton}
          >
            <EllipsisVertical size={20} />
          </Button>
          <div className={styles.buttons}>
            <Button variant="outline" onClick={onFollow}>
              Suivre
            </Button>
            <Button variant="outline" onClick={onMessage}>
              Message
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserHeader;
