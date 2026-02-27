"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserPlus, Route, MessageSquare, Share2, Bookmark } from "lucide-react";
import RoundButton from "@/components/common/buttons/RoundButton";
import ShareModal from "@/components/common/modals/ShareModal";
import useFollow from "@/hooks/useFollow";
import useFollowStatus from "@/hooks/useFollowStatus";
import { useAuth } from "@/hooks/useAuth";
import { handleGetDirections } from "@/utils/mapNavigation";
import { findConversationWithUser } from "@/lib/api/conversations";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";
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
  const { user: currentUser } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { follow, unfollow, isLoading: isFollowLoading } = useFollow();
  const { isFollowing, followId, setIsFollowing, setFollowId } =
    useFollowStatus({
      currentUserId: currentUser?._id,
      targetUserId: user._id,
    });

  const handleFollow = async () => {
    try {
      const result = await follow(user._id);
      setIsFollowing(true);
      setFollowId(result?._id || null);
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

    if (!currentUser?._id) {
      router.push(`/${locale}/auth/register`);
      return;
    }

    const conversationId = await findConversationWithUser(user._id);
    router.push(
      `/${locale}/inbox?conversationId=${conversationId || "new"}&recipientId=${user._id}`,
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
    "Profil créateur";
  const shareText = place?.name ? `${shareTitle} - ${place.name}` : shareTitle;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const showFollowButton = currentUser?._id !== user._id;
  const showMessageButton = !isOwner;
  const showDirectionsButton = !!place?.location?.coordinates;

  const handleFollowClick = () => {
    if (!currentUser?._id) {
      router.push(`/${locale}/auth/register`);
      return;
    }

    if (isFollowing) {
      void handleUnfollow();
    } else {
      void handleFollow();
    }
  };

  return (
    <div className={styles.actionsRow}>
      <div className={styles.actionItem}>
        {showFollowButton ? (
          <RoundButton
            icon={<UserPlus size={18} />}
            label={isFollowing ? "Abonné" : "S'abonner"}
            onClick={handleFollowClick}
            disabled={isFollowLoading}
            variant={isFollowing ? "primary" : "secondary"}
            ariaLabel={isFollowing ? "Ne plus suivre" : "S'abonner"}
          />
        ) : (
          <div className={styles.actionPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.actionItem}>
        {showMessageButton ? (
          <RoundButton
            icon={<MessageSquare size={18} />}
            label="Messages"
            onClick={handleMessageClick}
            variant="secondary"
            ariaLabel="Envoyer un message"
          />
        ) : (
          <div className={styles.actionPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.actionItem}>
        {showDirectionsButton ? (
          <RoundButton
            icon={<Route size={18} />}
            label="Itinéraire"
            onClick={handleDirectionsClick}
            variant="primary"
            ariaLabel="Voir l'itinéraire"
          />
        ) : (
          <div className={styles.actionPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.actionItem}>
        <RoundButton
          icon={<Share2 size={18} />}
          label="Partager"
          onClick={() => setIsShareModalOpen(true)}
          variant="secondary"
          ariaLabel="Partager"
        />
      </div>
      <div className={styles.actionItem}>
        <RoundButton
          icon={<Bookmark size={18} />}
          label="Enregistrer"
          onClick={() => {}}
          variant="secondary"
          ariaLabel="Enregistrer"
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
