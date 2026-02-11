import CreatorTabs from "@/components/creator/creatorTabs";
import styles from "./MapCreatorCardContent.module.scss";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface MapCreatorCardContentProps {
  user: UserPopulated;
  isOwner: boolean;
  place: Place | null;
  isPlaceLoading: boolean;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
  onPlaceRefetch?: () => void;
  onFollowChange?: (delta: number) => void;
}

const MapCreatorCardContent = ({
  user,
  isOwner,
  place,
  isPlaceLoading,
  onMapButtonClick,
  onPlaceRefetch,
  onFollowChange,
}: MapCreatorCardContentProps) => {
  const canHandleImages = false;
  return (
    <div className={styles.content}>
      <CreatorTabs
        user={user}
        place={place}
        onMapButtonClick={onMapButtonClick}
        onPlaceRefetch={onPlaceRefetch}
        onFollowChange={onFollowChange}
        isOwner={isOwner}
        canHandleImages={canHandleImages}
        isPlaceLoading={isPlaceLoading}
      />
    </div>
  );
};

export default MapCreatorCardContent;
