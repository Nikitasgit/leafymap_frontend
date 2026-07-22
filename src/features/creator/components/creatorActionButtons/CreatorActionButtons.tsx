"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { UserPlus, Route, MessageSquare, Share2, Bookmark } from "lucide-react";
import RoundButton from "@/shared/ui/buttons/roundButton";
import ShareModal from "@/shared/ui/modals/shareModal";
import useFollow from "@/features/follows/hooks/useFollow";
import useFollowStatus from "@/features/follows/hooks/useFollowStatus";
import { useAuth } from "@/features/auth";
import { handleGetDirections } from "@/features/map/utils/mapNavigation";
import { findConversationWithUser } from "@/features/messages/api/conversationsApi";
import { Place } from "@/features/places/types/place";
import { UserPopulated } from "@/features/users/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addFavorite,
  removeFavorite,
  selectIsPlaceFavorited,
} from "@/features/favorites";
import styles from "./CreatorActionButtons.module.scss";

export interface CreatorActionButtonsProps {
  user: UserPopulated;
  place: Place | null;
  isOwner: boolean;
  refetchUser: () => void;
}

const CreatorActionButtons = ({
  user,
  place,
  isOwner,
  refetchUser,
}: CreatorActionButtonsProps) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslation("profile");
  const { user: currentUser } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { follow, unfollow, isLoading: isFollowLoading } = useFollow();
  const { isFollowing, followId, setIsFollowing, setFollowId } =
    useFollowStatus({
      currentUserId: currentUser?.id,
      targetUserId: user.id,
    });
  const dispatch = useAppDispatch();
  const isPlaceFavorited = useAppSelector(selectIsPlaceFavorited(place?.id));
  const isFavoritesLoading = useAppSelector(
    (state) => state.favorites.loading,
  );

  const handleFollow = async () => {
    try {
      const result = await follow(user.id);
      setIsFollowing(true);
      setFollowId(result?.id || null);
      refetchUser();
    } catch {
      // Error handled in hook
    }
  };

  const handleUnfollow = async () => {
    if (!followId) return;
    try {
      await unfollow(followId);
      setIsFollowing(false);
      setFollowId(null);
      refetchUser();
    } catch {
      // Error handled in hook
    }
  };

  const handleMessageClick = async () => {
    if (isOwner) return;

    if (!currentUser?.id) {
      router.push(`/${locale}/auth/register`);
      return;
    }

    const conversationId = await findConversationWithUser(user.id);
    router.push(
      `/${locale}/inbox?conversationId=${conversationId || "new"}&recipientId=${user.id}`,
    );
  };

  const handleDirectionsClick = () => {
    if (place?.location?.coordinates) {
      handleGetDirections(place.location.coordinates);
    }
  };

  const shareTitle =
    [user.firstname, user.lastname].filter(Boolean).join(" ") ||
    user.username ||
    t("marketing:account.shareHostProfile");
  const shareText = place?.name ? `${shareTitle} - ${place.name}` : shareTitle;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const showFollowButton = currentUser?.id !== user.id;
  const showMessageButton = !isOwner;
  const showDirectionsButton = !!place?.location?.coordinates;

  const handleFollowClick = () => {
    if (!currentUser?.id) {
      router.push(`/${locale}/auth/register`);
      return;
    }

    if (isFollowing) {
      void handleUnfollow();
    } else {
      void handleFollow();
    }
  };

  const handleSaveClick = () => {
    if (!currentUser?.id) {
      router.push(`/${locale}/auth/register`);
      return;
    }
    if (!place?.id) return;
    if (isPlaceFavorited) {
      void dispatch(
        removeFavorite({ referenceId: place.id, referenceType: "Place" }),
      );
    } else {
      void dispatch(
        addFavorite({ referenceId: place.id, referenceType: "Place" }),
      );
    }
  };

  return (
    <div className={styles.actionsRow}>
      <div className={styles.actionItem}>
        {showFollowButton ? (
          <RoundButton
            icon={<UserPlus size={18} />}
            label={
              isFollowing
                ? t("creatorActionButtons.subscribed")
                : t("creatorActionButtons.subscribe")
            }
            onClick={handleFollowClick}
            disabled={isFollowLoading}
            variant={isFollowing ? "primary" : "secondary"}
            ariaLabel={
              isFollowing
                ? t("creatorActionButtons.unsubscribe")
                : t("creatorActionButtons.subscribe")
            }
          />
        ) : (
          <div className={styles.actionPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.actionItem}>
        {showMessageButton ? (
          <RoundButton
            icon={<MessageSquare size={18} />}
            label={t("creatorActionButtons.messages")}
            onClick={handleMessageClick}
            variant="secondary"
            ariaLabel={t("creatorActionButtons.sendMessage")}
          />
        ) : (
          <div className={styles.actionPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.actionItem}>
        {showDirectionsButton ? (
          <RoundButton
            icon={<Route size={18} />}
            label={t("creatorActionButtons.directions")}
            onClick={handleDirectionsClick}
            variant="primary"
            ariaLabel={t("creatorActionButtons.viewDirections")}
          />
        ) : (
          <div className={styles.actionPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.actionItem}>
        <RoundButton
          icon={<Share2 size={18} />}
          label={t("creatorActionButtons.share")}
          onClick={() => setIsShareModalOpen(true)}
          variant="secondary"
          ariaLabel={t("creatorActionButtons.share")}
        />
      </div>
      <div className={styles.actionItem}>
        <RoundButton
          icon={<Bookmark size={18} />}
          label={
            isPlaceFavorited
              ? t("creatorActionButtons.saved")
              : t("creatorActionButtons.save")
          }
          onClick={handleSaveClick}
          disabled={isFavoritesLoading || !place?.id}
          variant={isPlaceFavorited ? "primary" : "secondary"}
          ariaLabel={
            isPlaceFavorited
              ? t("creatorActionButtons.removeFromFavorites")
              : t("creatorActionButtons.save")
          }
        />
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={shareTitle}
        text={shareText}
        url={shareUrl}
      />
    </div>
  );
};

export default CreatorActionButtons;
