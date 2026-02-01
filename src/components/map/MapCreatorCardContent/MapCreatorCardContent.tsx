import CreatorTabs from "@/components/creator/creatorTabs";
import styles from "./MapCreatorCardContent.module.scss";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface MapCreatorCardContentProps {
  user: UserPopulated;
  isOwner: boolean;
  place: Place | null;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
  onPlaceRefetch?: () => void;
}

const MapCreatorCardContent = ({
  user,
  isOwner,
  place,
  onMapButtonClick,
  onPlaceRefetch,
}: MapCreatorCardContentProps) => {
  return (
    <div className={styles.content}>
      <CreatorTabs
        user={user}
        place={place}
        onMapButtonClick={onMapButtonClick}
        onPlaceRefetch={onPlaceRefetch}
        isOwner={isOwner}
      />
    </div>
  );
};

export default MapCreatorCardContent;
