"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MapCreatorCard.module.scss";
import { useAuth } from "@/hooks/useAuth";
import { useEvent } from "@/hooks/useEvent";
import { navigateToPlaceOnMap } from "@/utils/mapNavigation";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import CreatorHeader from "@/components/creator/creatorHeader";
import MapCreatorCardContent from "../MapCreatorCardContent";
import { useCreatorData } from "@/hooks/useCreatorData";
import { isSameId } from "@/utils/id";
import EventModal from "@/components/common/modals/EventModal";
import { Event, EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";

const getEventCoordinates = (event: Event) => {
  if (event.location?.coordinates) return event.location.coordinates;
  return typeof event.place === "object" && event.place?.location?.coordinates
    ? event.place.location.coordinates
    : [];
};

const MapCreatorCard = ({
  userId,
  initialEventId,
  mapRef,
  skipFetchPlacesInView = false,
  onLoadingChange,
}: MapCreatorCardProps) => {
  const { user, place, isLoading, refetch } = useCreatorData(userId);
  const { user: currentUser } = useAuth();
  const isOwner = isSameId(currentUser?._id, user?._id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    initialEventId || null
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(Boolean(initialEventId));
  const { event: selectedEvent, isLoading: isLoadingEvent } = useEvent(
    selectedEventId || ""
  );

  // Track which place we've already navigated to so we don't flyTo twice
  // when place is refetched (e.g. after an edit).
  const navigatedPlaceIdRef = useRef<string | null>(null);

  // Reset navigation ref when the card opens for a different user.
  useEffect(() => {
    navigatedPlaceIdRef.current = null;
  }, [userId]);

  useEffect(() => {
    setSelectedEventId(initialEventId || null);
    setIsEventModalOpen(Boolean(initialEventId));
  }, [initialEventId]);

  // Fly to the place once when the data first loads or when userId changes.
  useEffect(() => {
    if (initialEventId) return;
    if (!place || !mapRef.current) return;
    if (navigatedPlaceIdRef.current === place._id) return;
    navigatedPlaceIdRef.current = place._id;
    navigateToPlaceOnMap({
      mapRef,
      placeId: place._id,
      coordinates: place.location?.coordinates || [],
      skipFetchPlacesInView,
    });
  }, [initialEventId, mapRef, place, skipFetchPlacesInView]);

  useEffect(() => {
    if (!selectedEvent || !initialEventId || !mapRef.current) return;
    if (navigatedPlaceIdRef.current === selectedEvent._id) return;
    const coordinates = getEventCoordinates(selectedEvent);
    if (coordinates.length < 2) return;
    navigatedPlaceIdRef.current = selectedEvent._id;
    navigateToPlaceOnMap({
      mapRef,
      placeId: selectedEvent._id,
      coordinates,
      skipFetchPlacesInView,
    });
  }, [initialEventId, mapRef, selectedEvent, skipFetchPlacesInView]);

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

  const selectedEventPlace =
    selectedEvent &&
    typeof selectedEvent.place === "object" &&
    selectedEvent.place
      ? (selectedEvent.place as PlacePopulated)
      : undefined;

  return (
    <>
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
      {isEventModalOpen && selectedEvent && !isLoadingEvent && (
        <EventModal
          key={selectedEventId}
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          event={selectedEvent as EventPopulated}
          place={selectedEventPlace || place || undefined}
          user={user}
          isContentLoading={isLoading}
        />
      )}
    </>
  );
};

export default MapCreatorCard;
