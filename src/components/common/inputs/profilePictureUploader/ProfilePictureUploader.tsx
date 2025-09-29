import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import styles from "./ProfilePictureUploader.module.scss";
import useSubmitImages from "@/hooks/useSubmitImages";
import useDeleteImages from "@/hooks/useDeleteImages";
import { Image as IImage } from "@/types/image";

interface ProfilePictureUploaderProps {
  initialImage?: IImage;
  onImageUploaded?: (imageUrl: string | null) => void;
  className?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  isOwner?: boolean;
  type: "User" | "Place" | "Event";
  reference: string;
  rounded?: boolean;
}

const ProfilePictureUploader = ({
  initialImage,
  onImageUploaded = () => {},
  className = "",
  size = "medium",
  isOwner = false,
  disabled = false,
  type,
  reference,
  rounded = false,
}: ProfilePictureUploaderProps): React.JSX.Element => {
  const [preview, setPreview] = useState<Pick<IImage, "_id" | "urls"> | null>(
    initialImage || null
  );

  const { deleteImages, isLoading: isLoadingDeleteImages } = useDeleteImages();
  const { submitImages, isLoading: isLoadingImages } = useSubmitImages();
  const isLoading = isLoadingDeleteImages || isLoadingImages;
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled || !isOwner) return;

    try {
      const response = await submitImages({
        files: [file],
        reference: reference,
        referenceType: type,
        type: "profile",
      });
      if (response && response.images.length > 0) {
        if (preview) {
          await deleteImages([preview._id]);
        }
        onImageUploaded(response.images[0]._id);
        setPreview({
          _id: response.images[0]._id,
          urls: response.images[0].signedUrls,
        });
      }
    } catch {
      setPreview(null);
    } finally {
      e.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (disabled || !isOwner || !preview) return;
    try {
      await deleteImages([preview._id]);
      setPreview(null);
      onImageUploaded(null);
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
            priority
            src={preview?.urls?.thumbnail || defaultAvatar}
            alt="Photo de profil"
            width={size === "small" ? 65 : size === "large" ? 120 : 100}
            height={size === "small" ? 65 : size === "large" ? 120 : 100}
            className={` ${styles.previewImage} ${
              rounded ? styles.rounded : ""
            }`}
          />{" "}
          {isOwner && preview && (
            <button
              onClick={handleDeleteImage}
              className={styles.deleteButton}
              disabled={isLoading || disabled}
              aria-label="Supprimer la photo"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${rounded ? styles.rounded : ""}`}
        >
          <div className={styles.uploadIcon}>
            {isLoading ? (
              <div className={styles.loadingSpinner} />
            ) : (
              <Upload size={14} />
            )}
          </div>
          <span className={styles.uploadText}>
            {isLoading ? "Téléchargement..." : "Ajouter une photo (max. 5MB)"}
          </span>
        </div>
      )}

      {isOwner && (
        <input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={handleFileChange}
          className={`${styles.fileInput} ${rounded ? styles.rounded : ""}`}
          disabled={isLoading || disabled}
        />
      )}
    </div>
  );
};

export default ProfilePictureUploader;
