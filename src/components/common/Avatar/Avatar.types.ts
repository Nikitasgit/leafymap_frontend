import type { UserDisplayInfo } from "@/utils/userDisplay";

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
