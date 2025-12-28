import { Image } from "@/types/image";

export interface GallerySectionProps {
  images: Image[];
  isLoading?: boolean;
  isUploading?: boolean;
  isOwner?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onImageDeleted?: () => void;
}
