import { PlacePopulated } from "@/types/place";
import React from "react";
import styles from "./PlaceSuggestionCard.module.scss";
import Image from "next/image";
import Text from "@/components/common/typography/Text";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const PlaceSuggestionCard = ({ place }: { place: PlacePopulated }) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (place.isCreatorPlace) {
      router.push(`/users/${place.user._id}`);
    } else {
      router.push(`/places/${place._id}`);
    }
  };

  return (
    <div className={styles.placeSuggestionCard} onClick={handleRedirect}>
      <div className={styles.imageContainer}>
        <Image
          src={place.image?.urls?.medium || "https://i.pravatar.cc/40?img=3"}
          alt={place.name}
          fill
          className={styles.image}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.infoContainer}>
        <Text as="h3" className={styles.title}>
          {place.name}
        </Text>
        <div className={styles.locationContainer}>
          <MapPin size={18} />
          <Text as="p" className={styles.location}>
            {place.location?.label}
          </Text>
        </div>
        <Text as="p" className={styles.description}>
          {place.description || "Aucune description disponible"}
        </Text>
        <PlaceCategoryBadge categoryName={place.placeCategory?.name || ""} />
      </div>
    </div>
  );
};

export default PlaceSuggestionCard;
