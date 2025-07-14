import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import useUpdateProfilePicture, {
  EntityType,
} from "@/hooks/useUpdateProfilePicture";
import styles from "./ProfilePictureUploader.module.scss";

interface ProfilePictureUploaderProps {
  entityType: EntityType;
  entityId?: string;
  initialImage?: string;
  onImageUploaded?: (imageUrl: string) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  isOwner?: boolean;
}

const ProfilePictureUploader = ({
  entityType,
  entityId,
  initialImage,
  onImageUploaded,
  className = "",
  size = "medium",
  isOwner = false,
  disabled = false,
}: ProfilePictureUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const { updateProfilePicture, isLoading } = useUpdateProfilePicture();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled || !isOwner) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const imageUrl = await updateProfilePicture({
        entityType,
        entityId,
        file,
      });

      if (imageUrl) {
        setPreview(imageUrl);
        onImageUploaded?.(imageUrl);
      } else {
        // Revert preview if upload failed
        setPreview(initialImage || null);
      }
    } catch {
      // Revert preview if upload failed
      setPreview(initialImage || null);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return styles.small;
      case "large":
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getOwnerClass = () => {
    return isOwner ? styles.owner : styles.nonOwner;
  };

  const defaultAvatar = "/images/default-avatar.png";
  const displayImage = preview || defaultAvatar;

  return (
    <div
      className={`${
        styles.uploadArea
      } ${getSizeClass()} ${getOwnerClass()} ${className}`}
    >
      {preview || !isOwner ? (
        <div className={styles.imageContainer}>
          <Image
            src={displayImage}
            alt="Photo de profil"
            width={size === "small" ? 80 : size === "large" ? 150 : 120}
            height={size === "small" ? 80 : size === "large" ? 150 : 120}
            className={styles.previewImage}
          />
          {isOwner && (
            <div className={styles.overlay}>
              <span className={styles.changeText}>
                {isLoading ? "Téléchargement..." : "Changer"}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.uploadIcon}>
            {isLoading ? <div className={styles.loadingSpinner} /> : <Upload />}
          </div>
          <span className={styles.uploadText}>
            {isLoading ? "Téléchargement..." : "Ajouter une photo"}
          </span>
        </div>
      )}

      {isOwner && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
          disabled={isLoading || disabled}
        />
      )}
    </div>
  );
};

export default ProfilePictureUploader;
