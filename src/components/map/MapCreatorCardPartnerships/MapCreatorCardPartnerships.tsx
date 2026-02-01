import { useState, useEffect } from "react";
import styles from "./MapCreatorCardPartnerships.module.scss";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventCard from "@/components/common/events/EventCard";
import { CreatorCard } from "@/components/userProfile/PlacesSection/CreatorCard";
import { PartnershipPopulated } from "@/types/partnerships";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { UserPopulated } from "@/types/user";
import EventModal from "@/components/common/modals/EventModal/EventModal";
import { useEvent } from "@/hooks/useEvent";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";

export interface MapCreatorCardPartnershipsProps {
  eventInvitations?: EventInvitationPopulated[];
  placePartnerships: PartnershipPopulated[];
  username: string;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
}

const MapCreatorCardPartnerships = ({
  eventInvitations = [],
  placePartnerships,
  username,
  onMapButtonClick,
}: MapCreatorCardPartnershipsProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlacePopulated | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserPopulated | null>(null);

  const { event: selectedEvent, isLoading: isLoadingEvent } = useEvent(
    selectedEventId || ""
  );

  useEffect(() => {
    if (selectedEvent?.place && typeof selectedEvent.place === "object") {
      setSelectedPlace(selectedEvent.place as PlacePopulated);
    }
  }, [selectedEvent]);

  const handleEventClick = (
    eventId: string,
    place: PlacePopulated | null | undefined,
    user: UserPopulated | undefined
  ) => {
    setSelectedEventId(eventId);
    setSelectedPlace(place ?? null);
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setSelectedPlace(null);
    setSelectedUser(null);
  };

  if (eventInvitations.length === 0 && placePartnerships.length === 0) {
    return null;
  }

  return (
    <div className={styles.placesAndEventsSection}>
      {eventInvitations.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <b> {capitalizeFirstLetter(username)} </b> participe à ces
            événements ({eventInvitations.length}):
          </h3>
          {eventInvitations.map((invitation) => {
            const event = invitation.event;
            const initiator = invitation.initiator;

            if (!event || !event._id) return null;

            return (
              <div
                key={invitation._id}
                onClick={() =>
                  handleEventClick(
                    event._id,
                    undefined,
                    initiator as UserPopulated | undefined
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <EventCard
                  event={event as EventPopulated}
                  place={undefined}
                  user={initiator as UserPopulated | undefined}
                  clickable={false}
                />
              </div>
            );
          })}
        </section>
      )}
      {placePartnerships.length > 0 && (
        <section className={styles.section} aria-labelledby="places-title">
          <h3 id="places-title" className={styles.sectionTitle}>
            Retrouvez également <b> {capitalizeFirstLetter(username)} </b>
            ici ({placePartnerships.length}):
          </h3>

          {placePartnerships.map((partnership) => {
            const place =
              typeof partnership.place === "object" ? partnership.place : null;

            if (!place) return null;

            return (
              <CreatorCard
                key={partnership._id}
                user={partnership.initiator as UserPopulated}
                place={place}
                actions={[
                  {
                    type: "view",
                    onClick: () => onMapButtonClick(place),
                    ariaLabel: `Voir ${place.name} sur la carte`,
                  },
                ]}
              />
            );
          })}
        </section>
      )}

      {isModalOpen && selectedEvent && !isLoadingEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent as EventPopulated}
          place={selectedPlace || undefined}
          user={selectedUser || undefined}
        />
      )}
    </div>
  );
};

export default MapCreatorCardPartnerships;
