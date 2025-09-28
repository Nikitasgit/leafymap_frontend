import { Image } from "@/types/image";
export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Image[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  isOwner?: boolean;
  onDeleteImage?: (imageId: string) => void;
}
