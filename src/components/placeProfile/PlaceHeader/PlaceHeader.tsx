import React from "react";
import { MapPin, Map } from "lucide-react";
import ProfilePictureUploader from "@/components/common/inputs/ProfilePictureUploader/ProfilePictureUploader";
import { PlacePopulated } from "@/types/place";
import styles from "./PlaceHeader.module.scss";
import Button from "@/components/common/buttons/Button";
import { Image } from "@/types/image";
import SubscribersCounter from "@/components/common/counters/SubscribersCounter/SubscribersCounter";
import BackButton from "@/components/common/buttons/BackButton";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";

interface PlaceHeaderProps {
  place: PlacePopulated;
  onFollow: () => void;
}

const PlaceHeader: React.FC<PlaceHeaderProps> = ({ place, onFollow }) => {
  return (
    <header className={styles.header}>
      <BackButton />
      <div className={styles.topRow}>
        <ProfilePictureUploader
          type="Place"
          className={styles.placeImage}
          reference={place._id}
          initialImage={place.image as Image}
          isOwner={false}
          size="medium"
        />
        <div className={styles.rightInfo}>
          <div className={styles.counters}>
            <SubscribersCounter followers={place.followers?.length || 0} />
          </div>
          <PlaceCategoryBadge
            categoryName={place.placeCategory.name as string}
          />
          <Button
            variant="outline"
            size="small"
            onClick={onFollow}
            ariaLabel="Suivre"
          >
            Suivre
          </Button>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.titleRow}>
          <Map size={18} className={styles.icon} />
          <h1 className={styles.title}>{place.name}</h1>
        </div>
        <div className={styles.locationInfo}>
          <MapPin size={14} />
          <p className={styles.location}>{place.location?.label}</p>
        </div>
        <p className={styles.description}>{place.description}</p>
      </div>
    </header>
  );
};

export default PlaceHeader;
