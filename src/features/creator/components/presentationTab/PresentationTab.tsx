import { useMemo } from "react";
import MapPlaceCardSchedule from "@/features/map/components/mapPlaceCardSchedule";
import MapCreatorCardPartnerships from "@/features/map/components/mapCreatorCardPartnerships";
import { capitalizeFirstLetter } from "@/shared/utils/functions";
import { Place, PlacePopulated } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";
import { useEventInvitationsByUserId } from "@/features/eventInvitations/hooks/useEventInvitationsByUserId";
import styles from "./PresentationTab.module.scss";
import { usePartnershipsAccepted } from "@/features/partnerships";
import UsersListXScroll, {
  type UsersListXScrollUser,
} from "@/features/users/components/usersListXScroll";
import type { Partnership } from "@/features/partnerships/types";
import { ProductCategoriesBadges } from "./productCategoriesBadges";
import CreatorActionButtons from "../creatorActionButtons";

export interface PresentationTabProps {
  place: Place | null;
  isPlaceLoading: boolean;
  user: UserPopulated;
  isOwner?: boolean;
  onMapButtonClick: (placeItem: {
    location: { coordinates: number[] } | null;
    id: string;
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
  const { eventInvitations } = useEventInvitationsByUserId(user.id, {
    asCollaborator: "true",
    includeCancelledEvents: "false",
    includePastEvents: "false",
    onlyAccepted: "true",
  });
  const { partnerships, isLoading: isPartnershipsLoading } =
    usePartnershipsAccepted(user.id);

  const partnershipUsers = useMemo((): UsersListXScrollUser[] => {
    const currentUserId = user.id;
    return partnerships
      .map((p: Partnership) => {
        const isInitiatorCurrent =
          p.initiator && p.initiator.id === currentUserId;
        const other = isInitiatorCurrent
          ? p.collaborator
          : (p.initiator ?? p.collaborator);
        const image =
          typeof other.image === "string"
            ? { urls: { thumbnail: other.image } }
            : other.image?.urls
              ? { urls: other.image.urls }
              : undefined;
        return {
          id: other.id,
          username: other.username,
          image,
          userCategory: other.userCategory,
        };
      })
      .filter((u) => u.id !== currentUserId);
  }, [partnerships, user.id]);

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
      <ProductCategoriesBadges userId={user.id} />
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
