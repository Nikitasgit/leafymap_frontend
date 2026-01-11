import MapPlaceCardSchedule from "../MapPlaceCardSchedule";
import MapCreatorCardPartnerships from "../MapCreatorCardPartnerships";
import { capitalizeFirstLetter } from "@/utils/functions";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { useUserPlacesPartnershipsByUserId } from "@/hooks/useUserPlacesPartnershipsByUserId";
import { useUserEventsPartnershipsByUserId } from "@/hooks/useUserEventsPartnershipsByUserId";
import styles from "./PresentationTab.module.scss";
import UsersListXScroll from "@/components/common/users/UsersListXScroll";

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
      asCollaborator: "false",
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
      {place?._id && placePartnerships.length > 0 && (
        <UsersListXScroll
          users={placePartnerships.map((partnership: any) => {
            const collaborator = partnership.collaborator;
            return {
              _id: collaborator._id,
              name: collaborator.username,
              image: collaborator.image?.urls?.thumbnail,
              category: collaborator.userCategories?.[0]?.name,
            };
          })}
          title={
            <>
              <b>{capitalizeFirstLetter(user.username || "")}</b> collabore avec
              :
            </>
          }
          showCategory={true}
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
