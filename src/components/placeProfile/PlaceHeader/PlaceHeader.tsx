import React from "react";
import { MapPin, Map } from "lucide-react";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader/ProfilePictureUploader";
import { Place } from "@/types/place";
import styles from "./PlaceHeader.module.scss";
import Button from "@/components/common/buttons/button/Button";
import { Image } from "@/types/image";
import ReviewsCounter from "@/components/common/counters/ReviewCounter";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";

interface PlaceHeaderProps {
  place: Place;
  onFollow: () => void;
  onMessage: () => void;
}

const PlaceHeader: React.FC<PlaceHeaderProps> = ({
  place,
  onFollow,
  onMessage,
}) => {
  return (
    <header className={styles.header}>
      <ProfilePictureUploader
        type="Place"
        className={styles.placeImage}
        reference={place._id}
        initialImage={place.image as Image}
        isOwner={false}
        size="medium"
      />
      <div className={styles.headerInfo}>
        <div className={styles.headerFirstRow}>
          <div className={styles.titleRow}>
            <Map size={18} className={styles.icon} />
            <h1 className={styles.title}>{place.name}</h1>
          </div>
          <div className={styles.counters}>
            <SubscribersCounter followers={place.followers?.length || 0} />
            <ReviewsCounter rating={place.rating || 0} />
          </div>
        </div>
        <div className={styles.headerMain}>
          <div className={styles.placeDetails}>
            <p className={styles.description}>{place.description}</p>
            <div className={styles.locationInfo}>
              <MapPin size={14} />
              <p className={styles.location}>{place.location?.label}</p>
            </div>
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

export default PlaceHeader;
