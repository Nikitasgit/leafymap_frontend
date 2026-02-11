"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserPlus, Route, MessageSquare, Share2, Bookmark } from "lucide-react";
import RoundButton from "@/components/common/buttons/RoundButton";
import useFollow from "@/hooks/useFollow";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { handleGetDirections } from "@/utils/mapNavigation";
import { findConversationWithUser } from "@/lib/api/conversations";
import { Place } from "@/types/place";
import { UserPopulated } from "@/types/user";
import axios from "axios";
import styles from "./CreatorActionButtons.module.scss";

export interface CreatorActionButtonsProps {
  user: UserPopulated;
  place: Place | null;
  isOwner: boolean;
  onFollowChange?: (delta: number) => void;
}

const CreatorActionButtons = ({
  user,
  place,
  isOwner,
  onFollowChange,
}: CreatorActionButtonsProps) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { user: currentUser } = useCurrentUser();
  const { follow, unfollow, isLoading: isFollowLoading } = useFollow();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?._id || !user._id || currentUser._id === user._id) return;
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/follows/check`,
          {
            params: {
              follower: currentUser._id,
              following: user._id,
            },
            withCredentials: true,
          }
        );
        const followData = response.data.data.follow;
        setIsFollowing(!!followData);
        if (followData) setFollowId(followData._id);
      } catch {
        setIsFollowing(false);
      }
    };
    checkFollowStatus();
  }, [currentUser?._id, user._id]);

  const handleFollow = async () => {
    try {
      const result = await follow(user._id);
      setIsFollowing(true);
      setFollowId(result?._id || null);
      onFollowChange?.(1);
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
      onFollowChange?.(-1);
    } catch {
      // Error handled in hook
    }
  };

  const handleMessageClick = async () => {
    if (isOwner) return;
    const conversationId = await findConversationWithUser(user._id);
    router.push(
      `/${locale}/inbox?conversationId=${conversationId || "new"}&recipientId=${user._id}`
    );
  };

  const handleDirectionsClick = () => {
    if (place?.location?.coordinates) {
      handleGetDirections(place.location.coordinates);
    }
  };

  const showFollowButton = currentUser?._id && currentUser._id !== user._id;
  const showMessageButton = !isOwner && currentUser?._id;
  const showDirectionsButton = !!place?.location?.coordinates;

  return (
    <div className={styles.actionsRow}>
      <div className={styles.actionItem}>
        {showFollowButton ? (
          <RoundButton
            icon={<UserPlus size={18} />}
            label={isFollowing ? "Abonné" : "S'abonner"}
            onClick={isFollowing ? handleUnfollow : handleFollow}
            disabled={isFollowLoading}
            variant={isFollowing ? "primary" : "secondary"}
            ariaLabel={isFollowing ? "Ne plus suivre" : "S'abonner"}
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
        <RoundButton
          icon={<Share2 size={18} />}
          label="Partager"
          onClick={() => {}}
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
    </div>
  );
};

export default CreatorActionButtons;
