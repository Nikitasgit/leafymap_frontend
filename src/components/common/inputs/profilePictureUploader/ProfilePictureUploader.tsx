import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import styles from "./ProfilePictureUploader.module.scss";
import useSubmitImages from "@/hooks/useSubmitImages";
import useDeleteImages from "@/hooks/useDeleteImages";
import { Image as IImage } from "@/types/image";

interface ProfilePictureUploaderProps {
  initialImage?: IImage;
  onImageUploaded: (imageUrl: string | null) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  isOwner?: boolean;
  type: "User" | "Place" | "Event";
  reference: string;
}

const ProfilePictureUploader = ({
  initialImage,
  onImageUploaded,
  className = "",
  size = "medium",
  isOwner = false,
  disabled = false,
  type,
  reference,
}: ProfilePictureUploaderProps) => {
  const [preview, setPreview] = useState<Pick<IImage, "_id" | "url"> | null>(
    initialImage || null
  );
  const { deleteImages, isLoading: isLoadingDeleteImages } = useDeleteImages();
  const { submitImages, isLoading: isLoadingImages } = useSubmitImages();
  const isLoading = isLoadingDeleteImages || isLoadingImages;
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled || !isOwner) return;
    const previewUrl = URL.createObjectURL(file);
    setPreview({ ...initialImage, url: previewUrl } as IImage);
    try {
      const response = await submitImages({
        files: [file],
        reference: reference,
        referenceType: type,
        type: "profile",
      });
      if (response && response.images.length > 0) {
        onImageUploaded(response.images[0]._id);
        setPreview({
          _id: response.images[0]._id,
          url: response.images[0].signedUrl,
        });
      }
    } catch {
      setPreview(null);
    }
  };

  const handleDeleteImage = async () => {
    if (disabled || !isOwner || !preview) return;
    try {
      const success = await deleteImages([preview._id]);
      if (success) {
        setPreview(null);
        onImageUploaded(null);
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
            src={preview?.url || defaultAvatar}
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
