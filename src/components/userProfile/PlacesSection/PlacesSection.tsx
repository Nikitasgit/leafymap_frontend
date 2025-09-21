import React from "react";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import Text from "@/components/common/typography/Text";
import { PartnershipPopulated } from "@/types/partnerships";
import { User } from "@/types/user";
import styles from "./PlacesSection.module.scss";

interface PlacesSectionProps {
  placePartnerships: PartnershipPopulated[];
  user: User;
}

const PlacesSection: React.FC<PlacesSectionProps> = ({
  placePartnerships,
  user,
}) => {
  return (
    <section className={styles.placesSection}>
      <Text as="h2">
        <MapPin
          size={20}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
        />
        Où retrouver {user.creatorName} ?
      </Text>
      <div className={styles.placesContainer}>
        {placePartnerships.length > 0 ? (
          <div className={styles.placesScroll}>
            {placePartnerships.map((partnership) => {
              const place = partnership.place;
              return (
                <div key={partnership._id} className={styles.placeCard}>
                  <div className={styles.placeImage}>
                    <Image
                      src={
                        place?.image?.urls?.medium ||
                        place?.image?.urls?.thumbnail ||
                        place?.image?.urls?.original ||
                        ""
                      }
                      alt={place?.name || "Place"}
                      width={120}
                      height={80}
                      className={styles.placeImg}
                    />
                  </div>
                  <div className={styles.placeInfo}>
                    <Text as="h3" className={styles.placeName}>
                      {place?.name}
                    </Text>
                    <Text as="p" className={styles.placeAddress}>
                      {place?.location?.label || "Adresse non disponible"}
                    </Text>
                    <div className={styles.placeStats}>
                      <div className={styles.followers}>
                        <Users size={12} className={styles.followersIcon} />
                        <span className={styles.followersText}>
                          {user?.followers?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MapPin className={styles.icon} />
            <Text as="p" className={styles.text}>
              Aucun lieu associé pour le moment
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlacesSection;
