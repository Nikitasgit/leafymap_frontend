import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import useAwsImages from "@/hooks/useAwsImages";
import styles from "./ProfilePictureUploader.module.scss";

interface ProfilePictureUploaderProps {
  initialImage?: string;
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  isOwner?: boolean;
}

const ProfilePictureUploader = ({
  initialImage,
  onImageUploaded,
  className = "",
  size = "medium",
  isOwner = false,
  disabled = false,
}: ProfilePictureUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const { uploadImages, deleteImages, isLoading } = useAwsImages();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled || !isOwner) return;
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    try {
      const uploadedImages = await uploadImages({
        files: [file],
      });
      if (uploadedImages) {
        const { url, signedUrl } = uploadedImages[0];
        onImageUploaded(url);
        if (preview && preview !== initialImage) {
          await deleteImages({
            imageUrls: [preview],
          });
        }
        setPreview(signedUrl);
      } else {
        setPreview(initialImage || null);
      }
    } catch {
      setPreview(initialImage || null);
    }
  };

  const handleDeleteImage = async () => {
    if (disabled || !isOwner || !preview) return;
    try {
      const success = await deleteImages({
        imageUrls: [preview],
      });
      if (success) {
        setPreview(null);
        onImageUploaded("");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
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

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

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
            width={size === "small" ? 80 : size === "large" ? 120 : 100}
            height={size === "small" ? 80 : size === "large" ? 120 : 100}
            className={styles.previewImage}
          />
          {isOwner && preview && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className={styles.deleteButton}
              disabled={isLoading || disabled}
              title="Supprimer la photo"
            >
              <Trash2 size={16} />
            </button>
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
