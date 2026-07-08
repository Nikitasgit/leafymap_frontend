import { useState } from "react";
import styles from "./MapCreatorCardPartnerships.module.scss";
import { capitalizeFirstLetter } from "@/utils/functions";
import EventCard from "@/components/common/events/EventCard";
import { EventInvitationPopulated } from "@/types/eventInvitation";
import { UserPopulated } from "@/types/user";
import EventModal from "@/components/common/modals/EventModal";
import { useEvent } from "@/hooks/useEvent";
import { EventPopulated } from "@/types/place/event";
import { PlacePopulated } from "@/types/place";

export interface MapCreatorCardPartnershipsProps {
  eventInvitations?: EventInvitationPopulated[];
  username: string;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
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
