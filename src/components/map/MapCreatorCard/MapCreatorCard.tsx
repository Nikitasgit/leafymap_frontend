"use client";

import { useEffect, useRef } from "react";
import styles from "./MapCreatorCard.module.scss";
import { useAuth } from "@/hooks/useAuth";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import CreatorHeader from "@/components/creator/creatorHeader";
import MapCreatorCardContent from "../MapCreatorCardContent";
import { useCreatorData } from "@/hooks/useCreatorData";
import { isSameId } from "@/utils/id";

const MapCreatorCard = ({
  userId,
  mapRef,
  skipFetchPlacesInView = false,
  onLoadingChange,
}: MapCreatorCardProps) => {
  const { user, place, isLoading, refetch } = useCreatorData(userId);
  const { user: currentUser } = useAuth();
  const isOwner = isSameId(currentUser?._id, user?._id);

  // Track which place we've already navigated to so we don't flyTo twice
  // when place is refetched (e.g. after an edit).
  const navigatedPlaceIdRef = useRef<string | null>(null);

  // Reset navigation ref when the card opens for a different user.
  useEffect(() => {
    navigatedPlaceIdRef.current = null;
  }, [userId]);

  // Fly to the place once when the data first loads or when userId changes.
  useEffect(() => {
    if (!place || !mapRef.current) return;
    if (navigatedPlaceIdRef.current === place._id) return;
    navigatedPlaceIdRef.current = place._id;
    navigateToPlaceOnMap({
      mapRef,
      placeId: place._id,
      coordinates: place.location?.coordinates || [],
      skipFetchPlacesInView,
    });
  }, [mapRef, place, skipFetchPlacesInView]);

  // Notify parent of loading state changes (e.g. to hide the collapse button).
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleMapButtonClick = async (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }): Promise<void> => {
    if (!placeItem.location) return;
    // Reset ref so the next navigateToPlaceOnMap call goes through.
    navigatedPlaceIdRef.current = null;
    await navigateToPlaceOnMap({
      mapRef,
      placeId: placeItem._id,
      coordinates: placeItem.location.coordinates,
      skipFetchPlacesInView,
    });
  };

  if (!user) return null;

  return (
    <article className={styles.placeCardMap}>
      <CreatorHeader place={place || null} user={user} isLoading={isLoading} />
      <MapCreatorCardContent
        place={place || null}
        isPlaceLoading={isLoading}
        user={user}
        isOwner={isOwner}
        onMapButtonClick={handleMapButtonClick}
        onPlaceRefetch={refetch}
        refetchUser={refetch}
      />
    </article>
  );
};

export default MapCreatorCard;
