import { Image } from "@/types/image";

export interface EventSmallCardEvent {
  id?: string;
  name: string;
  image?: Image | null;
}

export interface EventSmallCardProps {
  event: EventSmallCardEvent;
  enableNavigation?: boolean;
  className?: string;
}
