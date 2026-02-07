import MapPlaceCardSchedule from "@/components/map/MapPlaceCardSchedule";
import MapCreatorCardPartnerships from "@/components/map/MapCreatorCardPartnerships";
import { capitalizeFirstLetter } from "@/utils/functions";
import { Place, PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { useEventInvitationsByUserId } from "@/hooks/useEventInvitationsByUserId";
import styles from "./PresentationTab.module.scss";

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
      <MapCreatorCardPartnerships
        eventInvitations={eventInvitations}
        placePartnerships={[]}
        username={user.username || ""}
        onMapButtonClick={onMapButtonClick}
      />
    </>
  );
};

export default PresentationTab;
