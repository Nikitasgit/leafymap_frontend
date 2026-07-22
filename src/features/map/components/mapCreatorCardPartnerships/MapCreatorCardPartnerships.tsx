import { useState } from "react";
import { Trans } from "react-i18next";
import styles from "./MapCreatorCardPartnerships.module.scss";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import EventCard from "@/features/events/components/eventCard";
import { EventInvitationPopulated } from "@/features/eventInvitations/types/eventInvitation";
import { UserPopulated } from "@/features/users/types";
import EventModal from "@/features/events/components/eventModal";
import { useEvent } from "@/features/events";
import { EventPopulated } from "@/features/events/types/event";
import { PlacePopulated } from "@/features/places/types/place";

export interface MapCreatorCardPartnershipsProps {
  eventInvitations?: EventInvitationPopulated[];
  username: string;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    id: string;
  }) => Promise<void>;
}

const MapCreatorCardPartnerships = ({
  eventInvitations = [],
  username,
}: MapCreatorCardPartnershipsProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPopulated | null>(null);

  const { event: selectedEvent, isLoading: isLoadingEvent } = useEvent(
    selectedEventId || ""
  );
  const place = selectedEvent?.place;

  const handleEventClick = (
    eventId: string,
    user: UserPopulated | undefined
  ) => {
    setSelectedEventId(eventId);
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setSelectedUser(null);
  };

  if (eventInvitations.length === 0) {
    return null;
  }

  return (
    <div className={styles.placesAndEventsSection}>
      {eventInvitations.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Trans
              i18nKey="mapCreatorCardPartnerships.participatesInEvents"
              ns="map"
              values={{
                username: capitalizeFirstLetter(username),
                count: eventInvitations.length,
              }}
              components={{ bold: <b /> }}
            />
          </h3>
          {eventInvitations.map((invitation) => {
            const event = invitation.event;
            const initiator = invitation.initiator;
            if (!event || !event.id) return null;

            return (
              <div
                key={invitation.id}
                onClick={() =>
                  handleEventClick(
                    event.id,
                    initiator as UserPopulated | undefined
                  )
                }
                style={{ cursor: "pointer", marginBottom: "5px" }}
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

      {isModalOpen && selectedEvent && !isLoadingEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent as EventPopulated}
          place={place as PlacePopulated | undefined}
          user={selectedUser || undefined}
        />
      )}
    </div>
  );
};

export default MapCreatorCardPartnerships;
