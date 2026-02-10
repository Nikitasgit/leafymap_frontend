"use client";

import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import Button from "@/components/common/buttons/Button";
import useFollow from "@/hooks/useFollow";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import axios from "axios";

interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing: initialIsFollowing,
  onFollowChange,
}) => {
  const { follow, unfollow, isLoading } = useFollow();
  const { user: currentUser } = useCurrentUser();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [followId, setFollowId] = useState<string | null>(null);

  useEffect(() => {
    if (initialIsFollowing !== undefined) {
      setIsFollowing(initialIsFollowing);
    } else if (currentUser?._id && userId) {
      // Vérifier si l'utilisateur suit déjà cet utilisateur
      checkFollowStatus();
    }
  }, [currentUser?._id, userId, initialIsFollowing]);

  const checkFollowStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/follows/check`,
        {
          params: {
            follower: currentUser?._id,
            following: userId,
          },
          withCredentials: true,
        }
      );
      const follow = response.data.data.follow;
      setIsFollowing(!!follow);
      if (follow) {
        setFollowId(follow._id);
      }
    } catch (error) {
      // Erreur silencieuse - on assume que l'utilisateur ne suit pas
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    try {
      const result = await follow(userId);
      setIsFollowing(true);
      setFollowId(result?._id || null);
      onFollowChange?.(true);
    } catch (error) {
      // Erreur gérée dans le hook
    }
  };

  const handleUnfollow = async () => {
    if (!followId) {
      // Si on n'a pas le followId, on doit le récupérer d'abord
      await checkFollowStatus();
      return;
    }
    try {
      await unfollow(followId);
      setIsFollowing(false);
      setFollowId(null);
      onFollowChange?.(false);
    } catch (error) {

    }
  };

  if (currentUser?._id === userId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "primary" : "secondary"}
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={isLoading}
      size="xSmall"
      startIcon={<Leaf size={16} />}
      ariaLabel={isFollowing ? "Ne plus suivre" : "S'abonner"}
    >
      {isFollowing ? "Abonné" : "S'abonner"}
    </Button>
  );
};

export default FollowButton;
