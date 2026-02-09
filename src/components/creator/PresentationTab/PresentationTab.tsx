import { useMemo } from "react";
import MapPlaceCardSchedule from "@/components/map/MapPlaceCardSchedule";
import MapCreatorCardPartnerships from "@/components/map/MapCreatorCardPartnerships";
import { capitalizeFirstLetter } from "@/utils/functions";
import { Place, PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { useEventInvitationsByUserId } from "@/hooks/useEventInvitationsByUserId";
import styles from "./PresentationTab.module.scss";
import { usePartnershipsAccepted } from "@/hooks/usePartnershipsAccepted";
import UsersListXScroll, {
  type UsersListXScrollUser,
} from "@/components/common/users/UsersListXScroll";
import { Partnership } from "@/types/partnerships";

export interface PresentationTabProps {
  place: Place | null;
  isPlaceLoading: boolean;
  user: UserPopulated;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
}

const PresentationTab = ({
  place,
  isPlaceLoading = false,
  user,
  onMapButtonClick,
}: PresentationTabProps) => {
  const { eventInvitations } = useEventInvitationsByUserId(user._id, {
    asCollaborator: "true",
    includeCancelledEvents: "false",
    includePastEvents: "false",
    onlyAccepted: "true",
  });
  const { partnerships, isLoading: isPartnershipsLoading } =
    usePartnershipsAccepted(user._id);

  const partnershipUsers = useMemo((): UsersListXScrollUser[] => {
    const currentUserId = user._id;
    return partnerships
      .map((p: Partnership) => {
        const isInitiatorCurrent =
          p.initiator && p.initiator._id === currentUserId;
        const other = isInitiatorCurrent ? p.collaborator : p.initiator ?? p.collaborator;
        return {
          _id: other._id,
          username: other.username,
          image: other.image,
          userCategory: other.userCategory,
        };
      })
      .filter((u) => u._id !== currentUserId);
  }, [partnerships, user._id]);

  return (
    <>
      <div className={styles.descriptionRow}>
        <p>{capitalizeFirstLetter(user.description || "")}</p>
      </div>

      {place?.defaultSchedule && (
        <MapPlaceCardSchedule
          schedule={place?.defaultSchedule}
          place={place as PlacePopulated | null}
          user={user}
          isPlaceLoading={isPlaceLoading}
        />
      )}
      <UsersListXScroll
        users={partnershipUsers}
        title="Collaborateurs"
        showCategory
        loading={isPartnershipsLoading}
      />
      <MapCreatorCardPartnerships
        eventInvitations={eventInvitations}
        username={user.username || ""}
        onMapButtonClick={onMapButtonClick}
      />
    </>
  );
};

export default PresentationTab;
