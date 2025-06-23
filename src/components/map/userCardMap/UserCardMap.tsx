import React, { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./UserCardMap.module.scss";
import { MapPin, User, Map } from "lucide-react";
import { Collaborator } from "@/types/place/collaborators";
import { useFindCreatorInPlaces } from "@/hooks/useFindCreatorInPlaces";

const UserCardMap = ({ user }: { user: Collaborator }) => {
  const { data: userPlaces, findCreatorInPlaces } = useFindCreatorInPlaces();
  console.log(userPlaces);
  useEffect(() => {
    findCreatorInPlaces(user._id);
  }, [user._id, findCreatorInPlaces]);

  if (!userPlaces) return <div>Loading...</div>;

  return (
    <div className={styles.userCardMap}>
      <div className={styles.creatorProfile}>
        <div className={styles.creatorImageContainer}>
          <Image
            src={userPlaces.user?.image || "/images/default-user.png"}
            alt={userPlaces.user?.creatorProfile?.name || "Creator"}
            width={55}
            height={55}
            className={styles.creatorImage}
          />
        </div>
        <div className={styles.creatorInfo}>
          <h2 className={styles.creatorName}>
            {userPlaces.user?.creatorProfile?.name}
          </h2>
          <div className={styles.creatorCategories}>
            {userPlaces.user?.creatorProfile?.categories?.map((category) => (
              <Text key={category._id} className={styles.category}>
                {category.name}
              </Text>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.placesSection}>
        <h3 className={styles.placesTitle}>
          Où retrouver {userPlaces.user?.creatorProfile?.name} (
          {userPlaces.places?.length || 0})
        </h3>

        {userPlaces.places?.map((placeData) => (
          <div key={placeData.place._id} className={styles.placeCard}>
            <div className={styles.placeImageContainer}>
              <Image
                src={placeData.place.image || "/images/default-place.png"}
                alt={placeData.place.name}
                width={80}
                height={80}
                className={styles.placeImage}
              />
            </div>

            <div className={styles.placeContent}>
              <div className={styles.placeHeader}>
                <h4 className={styles.placeName}>{placeData.place.name}</h4>
                <div className={styles.placeButtons}>
                  <Button variant="secondary">
                    <User size={14} />
                  </Button>
                  <Button variant="secondary">
                    <Map size={14} />
                  </Button>
                </div>
              </div>

              <div className={styles.placeLocation}>
                <MapPin size={12} />
                <Text className={styles.locationText}>
                  {placeData.place.location.label}
                </Text>
              </div>

              {/* Events Section */}
              {placeData.events && placeData.events.length > 0 && (
                <div className={styles.eventsSection}>
                  <Text className={styles.eventsTitle}>
                    Events ({placeData.events.length})
                  </Text>
                  {placeData.events.map((event) => (
                    <div key={event._id} className={styles.eventCard}>
                      <div className={styles.eventImageContainer}>
                        <Image
                          src={event.image || "/images/default-event.png"}
                          alt={event.name}
                          width={40}
                          height={40}
                          className={styles.eventImage}
                        />
                      </div>
                      <div className={styles.eventInfo}>
                        <Text className={styles.eventName}>{event.name}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCardMap;
