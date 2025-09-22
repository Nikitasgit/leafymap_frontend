import React from "react";
import { ArrowLeft, Star, MapPin, Users } from "lucide-react";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader/ProfilePictureUploader";
import { Place } from "@/types/place";
import styles from "./PlaceHeader.module.scss";
import Button from "@/components/common/buttons/button/Button";
import { Image } from "@/types/image";

interface PlaceHeaderProps {
  place: Place;
  onFollow: () => void;
  onMessage: () => void;
  onBack: () => void;
}

const PlaceHeader: React.FC<PlaceHeaderProps> = ({
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
          type="Place"
          reference={place._id}
          initialImage={place.image as Image}
          isOwner={false}
          size="small"
          rounded
        />

        <div className={styles.placeInfo}>
          <Text as="h1">{place.name}</Text>
          <div className={styles.counters}>
            <div className={styles.counterRow}>
              <span className={styles.counter}>
                {place.followers?.length || 0}
              </span>
              <Users size={12} />
            </div>
            <div className={styles.counterRow}>
              <span className={styles.counter}>{place.rating || 0}</span>
              <div className={styles.starsContainer}>
                {renderStars(place.rating || 0)}
              </div>
            </div>
          </div>
          <Text as="p" className={styles.description}>
            {place.description}
          </Text>
          {place.location && (
            <div className={styles.locationInfo}>
              <MapPin size={14} />
              <Text as="p" className={styles.location}>
                {place.location.label}
              </Text>
            </div>
          )}
        </div>

        <div className={styles.buttons}>
          <Button variant="outline" onClick={onFollow}>
            Suivre
          </Button>
          <Button variant="primary" onClick={onMessage}>
            Contacter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlaceHeader;
