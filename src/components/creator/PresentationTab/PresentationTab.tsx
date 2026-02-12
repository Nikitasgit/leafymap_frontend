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
import { ProductCategoriesBadges } from "./ProductCategoriesBadges";
import CreatorActionButtons from "@/components/creator/CreatorActionButtons";

export interface PresentationTabProps {
  place: Place | null;
  isPlaceLoading: boolean;
  user: UserPopulated;
  isOwner?: boolean;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    _id: string;
  }) => Promise<void>;
  refetchUser: () => void;
}

const PresentationTab = ({
  place,
  isPlaceLoading = false,
  user,
  isOwner = false,
  onMapButtonClick,
  refetchUser,
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
        const other = isInitiatorCurrent
          ? p.collaborator
          : (p.initiator ?? p.collaborator);
        return {
          _id: other._id,
          username: other.username,
          image: other.image,
          userCategory: other.userCategory,
        };
      })
      .filter((u) => u._id !== currentUserId);
  }, [partnerships, user._id]);

  const websiteDisplayUrl = useMemo(() => {
    const url = user.website?.trim();
    if (!url) return null;
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return {
        href: urlObj.href,
        hostname: urlObj.hostname.replace(/^www\./, ""),
      };
    } catch {
      return { href: url, hostname: url };
    }
  }, [user.website]);

  return (
    <>
      <CreatorActionButtons
        user={user}
        place={place}
        isOwner={isOwner}
        refetchUser={refetchUser}
      />
      <ProductCategoriesBadges userId={user._id} />
      <span className={styles.descriptionLabel}>Description&nbsp;:</span>
      <div className={styles.descriptionRow}>
        <p>{capitalizeFirstLetter(user.description || "")}</p>
      </div>

      {websiteDisplayUrl && (
        <div className={styles.websiteRow}>
          <span className={styles.websiteLabel}>Site web :</span>{" "}
          <a
            href={websiteDisplayUrl.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            {websiteDisplayUrl.hostname}
          </a>
        </div>
      )}

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
