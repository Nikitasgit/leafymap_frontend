import { PlacePopulated } from "@/types/place";
import React from "react";
import styles from "./PlaceSuggestionCard.module.scss";
import Image from "next/image";
import PlaceCategoryBadge from "@/components/common/places/placeCategoryBadge/PlaceCategoryBadge";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import placeDefaultsSvg from "@public/images/place_default.svg";
import { capitalizeFirstLetter } from "@/utils/functions";

const PlaceSuggestionCard = ({ place }: { place: PlacePopulated }) => {
  const router = useRouter();

  const handleRedirect = () => {
    const user = typeof place.user === "object" ? place.user : null;
    if (user) {
      router.push(`/users/${user._id}`);
    }
  };

  return (
    <a
      className={styles.placeSuggestionCard}
      onClick={handleRedirect}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        <Image
          src={place.image?.urls?.medium || placeDefaultsSvg}
          alt={place.name}
          fill
          sizes="(min-width: 768px) 300px, (min-width: 576px) 280px, 220px"
          className={styles.image}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.title}>{capitalizeFirstLetter(place.name)}</h3>
        <div className={styles.locationContainer}>
          <MapPin size={18} />
          <p className={styles.location}>{place.location?.label}</p>
        </div>
        <p className={styles.description}>
          {place.description ||
            place.user?.description ||
            "Aucune description disponible"}
        </p>
        <PlaceCategoryBadge categoryName={place.placeCategory?.name || ""} />
      </div>
    </a>
  );
};

export default PlaceSuggestionCard;
