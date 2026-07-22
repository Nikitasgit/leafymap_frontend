export interface GallerySectionProps {
  reference: string | null;
  referenceType: "Place" | "User" | "Event" | "Message" | "Review" | null;
  isUploading?: boolean;
  canHandleImages?: boolean;
  onFilesSelected?: (files: File[]) => void;
}
