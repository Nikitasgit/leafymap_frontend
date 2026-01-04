export interface GallerySectionProps {
  reference: string | null;
  referenceType: "Place" | "User" | "Event" | "Message" | "Review" | null;
  isUploading?: boolean;
  isOwner?: boolean;
  onFilesSelected?: (files: File[]) => void;
}
