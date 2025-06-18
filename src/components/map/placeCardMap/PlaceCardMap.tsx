import React from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import Schedule from "@/components/common/schedule";
import styles from "./PlaceCardMap.module.scss";
import { Place } from "@/types/place";
import { MapPin, Heart } from "lucide-react";

const PlaceCardMap = ({ place }: { place: Place }) => {
  return (
    <div className={styles.placeCardMap}>
      <Image
        src={place?.image || "/images/default-place.png"}
        alt={place?.name || "Place image"}
        width={100}
        height={200}
      />
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>{place?.name}</h2>
        </div>
        <div className={styles.buttons}>
          <div className={styles.ratingRow}>
            <Heart size={16} className={styles.heartIcon} />
            <span className={styles.rating}>{place?.rating}</span>
          </div>
          <div className={styles.buttonGroup}>
            <Button variant="secondary">Itinéraire</Button>
            <Button variant="primary">Favoris</Button>
          </div>
        </div>
        <div className={styles.addressRow}>
          <span className={styles.addressIcon}>
            <MapPin size={14} />
          </span>
          <Text className={styles.address}>{place?.location.label}</Text>
        </div>
      </div>
      <div className={styles.descriptionRow}>
        <Text>{place?.description}</Text>
      </div>
      <Schedule schedule={place?.defaultSchedule || {}} />
    </div>
  );
};

export default PlaceCardMap;
