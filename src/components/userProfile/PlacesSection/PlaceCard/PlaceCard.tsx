import React from "react";
import { MapPin, Users } from "lucide-react";
import Text from "@/components/common/typography/Text";
import ProfilePictureUploader from "@/components/common/inputs/profilePictureUploader/ProfilePictureUploader";
import { Place } from "@/types/place";
import { User } from "@/types/user";
import { Image } from "@/types/image";
import styles from "./PlaceCard.module.scss";
import { useRouter } from "next/navigation";

interface PlaceCardProps {
  place: Place;
  user: User;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, user }) => {
  const router = useRouter();

  return (
    <div
      className={styles.placeCard}
      onClick={() => router.push(`/places/${place._id}`)}
    >
      <ProfilePictureUploader
        type="Place"
        reference={place._id}
        initialImage={place.image as Image}
        size="medium"
        isOwner={false}
      />

      <div className={styles.placeInfo}>
        <div className={styles.placeHeader}>
          <div className={styles.placeTitle}>
            <MapPin size={18} className={styles.placeIcon} />
            <Text as="h3">{place.name}</Text>
          </div>
        </div>

        <div className={styles.placeContent}>
          {place.description && (
            <Text as="p" className={styles.description}>
              {place.description.length > 120
                ? `${place.description.substring(0, 120)}...`
                : place.description}
            </Text>
          )}

          <div className={styles.placeDetails}>
            <div className={styles.locationInfo}>
              <MapPin size={14} className={styles.detailIcon} />
              <div className={styles.locationDetails}>
                <Text as="p" className={styles.locationName}>
                  {place.location?.label || "Adresse non disponible"}
                </Text>
              </div>
            </div>
            <div className={styles.followersInfo}>
              <Users size={14} className={styles.detailIcon} />
              <Text as="p" className={styles.detailText}>
                {user?.followers?.length || 0} followers
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
