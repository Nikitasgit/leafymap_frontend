import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import styles from "./ProfilePictureUploader.module.scss";
import useSubmitImages from "@/hooks/useSubmitImages";
import useDeleteImages from "@/hooks/useDeleteImages";
import { Image as IImage } from "@/types/image";
import placeDefaultsSvg from "@public/images/place_default.svg";
import creatorDefaultsSvg from "@public/images/creator_default.png";
import eventDefaultsSvg from "@public/images/event_default.svg";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";

interface ProfilePictureUploaderProps {
  initialImage?: IImage;
  googlePictureUrl?: string;
  onImageUploaded?: (
    imageUrl: string | null,
    googlePictureUrl?: string | null,
  ) => void;
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
  googlePictureUrl,
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
    initialImage || null,
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
    if (disabled || !isOwner || (!preview && !googlePictureUrl)) return;
    try {
      if (preview) {
        await deleteImages([preview._id]);
        setPreview(null);
        return;
      }
      if (googlePictureUrl) {
        onImageUploaded(null, googlePictureUrl);
      } else {
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

  const defaultAvatar =
    type === "Place"
      ? placeDefaultsSvg
      : type === "User"
        ? creatorDefaultsSvg
        : eventDefaultsSvg;

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

  return (
    <div
      className={`${
        styles.uploadArea
      } ${getSizeClass()} ${getOwnerClass()} ${className}`}
    >
      {(preview || !isOwner || googlePictureUrl) && !isLoading ? (
        <div className={styles.imageContainer}>
          <Image
            priority
            src={preview?.urls?.thumbnail || googlePictureUrl || defaultAvatar}
            alt="Photo de profil"
            width={size === "small" ? 65 : size === "large" ? 120 : 100}
            height={size === "small" ? 65 : size === "large" ? 120 : 100}
            className={` ${styles.previewImage} ${
              rounded ? styles.rounded : ""
            }`}
          />{" "}
          {isOwner && (preview || googlePictureUrl) && (
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
            {isLoading ? <LoadingSpinner size={18} /> : <Upload size={14} />}
          </div>
          <span className={styles.uploadText}>
            Ajouter une photo (max. 5MB)
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
