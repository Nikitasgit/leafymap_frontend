"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MapCreatorCard.module.scss";
import { useAuth } from "@/features/auth";
import { useEvent } from "@/features/events";
import { navigateToPlaceOnMap } from "@/features/map/utils/mapNavigation";
import { MapCreatorCardProps } from "./MapCreatorCard.types";
import CreatorHeader from "@/features/creator/components/creatorHeader";
import MapCreatorCardContent from "../mapCreatorCardContent";
import { useCreatorData } from "@/features/creator/hooks/useCreatorData";
import { isSameId } from "@/shared/utils/id";
import EventModal from "@/features/events/components/eventModal";
import { Event, EventPopulated } from "@/features/events/types/event";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";
import type { PlacePopulated } from "@/features/places/types/place";

const getEventCoordinates = (event: Event) => {
  if (event.location?.coordinates) return event.location.coordinates;
  return resolveRefObject(event.place)?.location?.coordinates ?? [];
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
  const isOwner = isSameId(currentUser?.id, user?.id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    initialEventId || null,
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(
    Boolean(initialEventId),
  );
  const [prevInitialEventId, setPrevInitialEventId] = useState(initialEventId);
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

  if (initialEventId !== prevInitialEventId) {
    setPrevInitialEventId(initialEventId);
    setSelectedEventId(initialEventId || null);
    setIsEventModalOpen(Boolean(initialEventId));
  }

  // Fly to the place once when the data first loads or when userId changes.
  useEffect(() => {
    if (initialEventId) return;
    if (!place || !mapRef.current) return;
    if (navigatedPlaceIdRef.current === place.id) return;
    navigatedPlaceIdRef.current = place.id;
    navigateToPlaceOnMap({
      mapRef,
      placeId: place.id,
      coordinates: place.location?.coordinates || [],
      skipFetchPlacesInView,
    });
  }, [initialEventId, mapRef, place, skipFetchPlacesInView]);

  useEffect(() => {
    if (!selectedEvent || !initialEventId || !mapRef.current) return;
    if (navigatedPlaceIdRef.current === selectedEvent.id) return;
    const coordinates = getEventCoordinates(selectedEvent);
    if (coordinates.length < 2) return;
    navigatedPlaceIdRef.current = selectedEvent.id;
    navigateToPlaceOnMap({
      mapRef,
      placeId: selectedEvent.id,
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
    id: string;
  }): Promise<void> => {
    if (!placeItem.location) return;
    // Reset ref so the next navigateToPlaceOnMap call goes through.
    navigatedPlaceIdRef.current = null;
    await navigateToPlaceOnMap({
      mapRef,
      placeId: placeItem.id,
      coordinates: placeItem.location.coordinates,
      skipFetchPlacesInView,
    });
  };

  if (!user) return null;

  const selectedEventPlace =
    (resolveRefObject(selectedEvent?.place) as PlacePopulated | null) ??
    undefined;

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
