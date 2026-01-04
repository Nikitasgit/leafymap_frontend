import MapPlaceCardSchedule from "../MapPlaceCardSchedule";
import MapCreatorCardPartnerships from "../MapCreatorCardPartnerships";
import PlaceInitiatorPartnerships from "../PlaceInitiatorPartnerships";
import { capitalizeFirstLetter } from "@/utils/functions";
import { Place } from "@/types/place";
import { PartnershipPopulated } from "@/types/partnerships";
import { UserPopulated } from "@/types/user";
import styles from "./PresentationTab.module.scss";

export interface PresentationTabProps {
  place: Place | null;
  placeUser: UserPopulated | null;
  eventPartnerships: PartnershipPopulated[];
  placePartnerships: PartnershipPopulated[];
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
}

const PresentationTab = ({
  place,
  placeUser,
  eventPartnerships,
  placePartnerships,
  onMapButtonClick,
}: PresentationTabProps) => {
  return (
    <>
      <div className={styles.descriptionRow}>
        <p>{capitalizeFirstLetter(placeUser?.description || "")}</p>
      </div>{" "}
      {place?._id && (
        <PlaceInitiatorPartnerships
          placeId={place._id}
          username={placeUser?.username || ""}
        />
      )}
      {place?.defaultSchedule && (
        <MapPlaceCardSchedule schedule={place?.defaultSchedule} />
      )}
      <MapCreatorCardPartnerships
        eventPartnerships={eventPartnerships}
        placePartnerships={placePartnerships}
        username={placeUser?.username || ""}
        onMapButtonClick={onMapButtonClick}
      />
    </>
  );
};

export default PresentationTab;
