"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./MapCreatorCard.module.scss";
import { useUser } from "@/hooks/useUser";
import { usePlace } from "@/hooks/usePlace";
import { useAuth } from "@/hooks/useAuth";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import CreatorHeader from "@/components/creator/creatorHeader";
import MapCreatorCardContent from "../MapCreatorCardContent";

const MapCreatorCard = ({ userId, mapRef }: MapCreatorCardProps) => {
  const { user, isLoading: isLoadingUser } = useUser(userId);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const { user: currentUser } = useAuth();
  const isOwner = Boolean(
    currentUser?._id && currentUser._id.toString() === user?._id?.toString()
  );
  const placeId = useMemo(() => {
    if (!user?.place) return null;
    return typeof user.place === "string" ? user.place : user.place._id;
  }, [user?.place]);

  const {
    place,
    isLoading: isLoadingPlace,
    refetch: refetchPlace,
  } = usePlace(placeId, {
    scheduleWithEvents: true,
  });

  const isLoading = isLoadingUser || isLoadingPlace;

  useEffect(() => {
    if (user?.followers !== undefined) {
      setFollowersCount(user.followers);
    }
  }, [user?.followers]);

  const handleFollowChange = (delta: number) => {
    setFollowersCount((prev) => Math.max(0, prev + delta));
  };

  useEffect(() => {
    if (mapRef.current && place) {
      navigateToPlaceOnMap({
        mapRef,
        placeId: place._id,
        coordinates: place.location?.coordinates || [],
      });
    }
  }, [mapRef, place]);

  const handleMapButtonClick = async (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }): Promise<void> => {
    if (!placeItem.location) return;
    await navigateToPlaceOnMap({
      mapRef,
      placeId: placeItem._id,
      coordinates: placeItem.location.coordinates,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <article className={styles.placeCardMap}>
      <CreatorHeader
        place={place || null}
        user={user}
        isLoading={isLoading}
      />
      <MapCreatorCardContent
        place={place || null}
        isPlaceLoading={isLoadingPlace}
        user={user}
        isOwner={isOwner}
        onMapButtonClick={handleMapButtonClick}
        onPlaceRefetch={refetchPlace}
        onFollowChange={handleFollowChange}
      />
    </article>
  );
};

export default MapCreatorCard;
