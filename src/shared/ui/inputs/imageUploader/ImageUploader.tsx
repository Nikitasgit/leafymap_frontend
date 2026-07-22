import React from "react";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/shared/ui/loading/loadingSpinner";
import styles from "./ImageUploader.module.scss";

interface ImageUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  iconSize?: number;
  disabled?: boolean;
  isLoading?: boolean;
  isUploading?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  className = "",
  iconSize = 24,
  disabled = false,
  isLoading = false,
  isUploading = false,
  }) => {
  const handleClick = () => {
    if (disabled || isLoading || isUploading) return;

    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.multiple = multiple;

      input.onchange = (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        if (files.length > 0) {
          onFilesSelected?.(files);
        }
      };

      input.click();
    } catch (error) {
      console.error("Error setting up file input:", error);
    }
  };

  return (
    <button
      className={`${styles.imageUploader} ${className}`}
      onClick={handleClick}
      type="button"
      disabled={disabled || isLoading}
    >
      {isUploading ? (
        <LoadingSpinner size={iconSize} />
      ) : (
        <Plus size={iconSize} className={styles.plusIcon} />
      )}
    </button>
  );
};

export default ImageUploader;
