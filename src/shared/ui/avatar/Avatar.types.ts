import type { UserDisplayInfo } from "@/shared/utils/userDisplay";

export interface AvatarUserInfo extends UserDisplayInfo {
  image?: {
    urls?: { thumbnail?: string };
  };
  googlePictureUrl?: string;
}

export interface AvatarProps {
  user?: AvatarUserInfo | null;
  size?: number;
  className?: string;
}
