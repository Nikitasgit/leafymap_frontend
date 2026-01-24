import MapPlaceCardSchedule from "@/components/map/MapPlaceCardSchedule";
import MapCreatorCardPartnerships from "@/components/map/MapCreatorCardPartnerships";
import { capitalizeFirstLetter } from "@/utils/functions";
import { Place, PlacePopulated } from "@/types/place";
import { UserPopulated } from "@/types/user";
import { useUserPlacesPartnershipsByUserId } from "@/hooks/useUserPlacesPartnershipsByUserId";
import { useUserEventsPartnershipsByUserId } from "@/hooks/useUserEventsPartnershipsByUserId";
import styles from "./PresentationTab.module.scss";
import UsersListXScroll from "@/components/common/users/UsersListXScroll";
import { usePlacePartnerships } from "@/hooks/usePlacePartnerships";

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
  const { partnerships: placesPartnerships } =
    useUserPlacesPartnershipsByUserId(user._id, {
      asCollaborator: "true",
      onlyAccepted: "true",
    });

  const { partnerships: eventsPartnerships } =
    useUserEventsPartnershipsByUserId(user._id, {
      asCollaborator: "true",
      includeCancelledEvents: "false",
      includePastEvents: "false",
      onlyAccepted: "true",
    });

  const { partnerships: placePartnerships } = usePlacePartnerships(
    place?._id || "",
    undefined,
    "place",
    { onlyAccepted: "true" }
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
        <MapPlaceCardSchedule
          schedule={place?.defaultSchedule}
          place={place as PlacePopulated | null}
          user={user} 
          isPlaceLoading={isPlaceLoading}
        />
      )}
      <MapCreatorCardPartnerships
        eventPartnerships={eventsPartnerships}
        placePartnerships={placesPartnerships}
        username={user.username || ""}
        onMapButtonClick={onMapButtonClick}
      />
    </>
  );
};

export default PresentationTab;
