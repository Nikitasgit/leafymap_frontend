"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./MapCreatorCard.module.scss";
import { useUser } from "@/hooks/useUser";
import { usePlace } from "@/hooks/usePlace";
import { useAuth } from "@/hooks/useAuth";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { findConversationWithUser } from "@/lib/api/conversations";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import CreatorHeader from "@/components/creator/creatorHeader";
import MapCreatorCardContent from "../MapCreatorCardContent";

const MapCreatorCard = ({ userId, mapRef }: MapCreatorCardProps) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { user, isLoading: isLoadingUser } = useUser(userId);
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

  const handleMessageClick = async (creatorUser: { _id: string }) => {
    if (isOwner) return;
    const conversationId = await findConversationWithUser(creatorUser._id);
    router.push(
      `/${locale}/inbox?conversationId=${conversationId || "new"}&recipientId=${
        creatorUser._id
      }`
    );
  };

  return (
    <article className={styles.placeCardMap}>
      <CreatorHeader
        place={place || null}
        user={user}
        isLoading={isLoading}
        onMessageClick={!isOwner ? handleMessageClick : undefined}
      />
      <MapCreatorCardContent
        place={place || null}
        user={user}
        isOwner={isOwner}
        onMapButtonClick={handleMapButtonClick}
        onPlaceRefetch={refetchPlace}
      />
    </article>
  );
};

export default MapCreatorCard;
