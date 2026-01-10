import MapPlaceCardSchedule from "../MapPlaceCardSchedule";
import MapCreatorCardPartnerships from "../MapCreatorCardPartnerships";
import PlaceInitiatorPartnerships from "../PlaceInitiatorPartnerships";
import { capitalizeFirstLetter } from "@/utils/functions";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { useUserPlacesPartnershipsByUserId } from "@/hooks/useUserPlacesPartnershipsByUserId";
import { useUserEventsPartnershipsByUserId } from "@/hooks/useUserEventsPartnershipsByUserId";
import styles from "./PresentationTab.module.scss";

export interface PresentationTabProps {
  place: Place | null;
  user: UserPopulated;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
}

const PresentationTab = ({
  place,
  user,
  onMapButtonClick,
}: PresentationTabProps) => {
  const { partnerships: placePartnerships } = useUserPlacesPartnershipsByUserId(
    user._id,
    {
      asCollaborator: "true",
      onlyAccepted: "true",
    }
  );

  const { partnerships: eventPartnerships } = useUserEventsPartnershipsByUserId(
    user._id,
    {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyAccepted: "true",
    }
  );

  return (
    <>
      <div className={styles.descriptionRow}>
        <p>{capitalizeFirstLetter(user.description || "")}</p>
      </div>
      {place?._id && (
        <PlaceInitiatorPartnerships
          placeId={place._id}
          username={user.username || ""}
        />
      )}
      {place?.defaultSchedule && (
        <MapPlaceCardSchedule schedule={place?.defaultSchedule} />
      )}
      <MapCreatorCardPartnerships
        eventPartnerships={eventPartnerships}
        placePartnerships={placePartnerships}
        username={user.username || ""}
        onMapButtonClick={onMapButtonClick}
      />
    </>
  );
};

export default PresentationTab;
