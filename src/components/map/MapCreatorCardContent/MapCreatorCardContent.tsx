import CreatorTabs from "@/components/creator/creatorTabs";
import styles from "./MapCreatorCardContent.module.scss";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";

export interface MapCreatorCardContentProps {
  user: UserPopulated;
  isOwner: boolean;
  place: Place | null;
  isPlaceLoading: boolean;
  onPlaceRefetch?: () => void;
  refetchUser: () => void;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    id: string;
  }) => Promise<void>;
}

const MapCreatorCardContent = ({
  user,
  isOwner,
  place,
  isPlaceLoading,
  onMapButtonClick,
  onPlaceRefetch,
  refetchUser,
}: MapCreatorCardContentProps) => {
  const canHandleImages = false;
  return (
    <div className={styles.content}>
      <CreatorTabs
        user={user}
        place={place}
        onMapButtonClick={onMapButtonClick}
        onPlaceRefetch={onPlaceRefetch}
        isOwner={isOwner}
        canHandleImages={canHandleImages}
        isPlaceLoading={isPlaceLoading}
        refetchUser={refetchUser}
      />
    </div>
  );
};

export default MapCreatorCardContent;
