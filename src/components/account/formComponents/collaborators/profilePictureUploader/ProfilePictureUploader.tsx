import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import styles from "./ProfilePictureUploader.module.scss";
import { useToast } from "@/hooks/useToast";
import { Upload } from "lucide-react";

type ProfilePictureUploaderProps = {
  onChange: FormDataChangeHandler;
  initialImage: string;
};

const ProfilePictureUploader = ({
  onChange,
  initialImage,
}: ProfilePictureUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const { showError } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showError(
          "Type de fichier invalide. Seuls JPEG, PNG, GIF et WebP sont autorisés."
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showError("La taille du fichier doit être inférieure à 5MB.");
        return;
      }

      setPreview(URL.createObjectURL(file));
      onChange({
        target: {
          name: "image",
          value: file,
        },
      });
    }
  };

  return (
    <div className={styles.uploadArea}>
      {preview ? (
        <div className={styles.imageContainer}>
          <Image
            src={preview}
            alt="Aperçu photo de profil"
            width={100}
            height={100}
            className={styles.previewImage}
          />
          <div className={styles.overlay}>
            <span className={styles.changeText}>Changer</span>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.uploadIcon}>
            <Upload />
          </div>
          <span className={styles.uploadText}>Ajouter une photo</span>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
};

export default ProfilePictureUploader;
